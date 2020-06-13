import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import codebuild = require('@aws-cdk/aws-codebuild');
import * as iam from '@aws-cdk/aws-iam';
import { CodeCommitTrigger } from '@aws-cdk/aws-codepipeline-actions';
import { CloudFormationCapabilities } from '@aws-cdk/aws-cloudformation';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const artifactsBucket = new s3.Bucket(this, "urlshorter-pipeline-artifact");
    // Import existing CodeCommit sam-app repository
    const codeRepo = codecommit.Repository.fromRepositoryName(
      this,
      'urlshoterRepository', // Logical name within CloudFormation
      'urlshoter' // Repository name
    );

    // Pipeline creation starts
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: artifactsBucket,
      role: iam.Role.fromRoleArn(this,'AWSCodePipelineServiceRole','arn:aws:iam::357518989200:role/service-role/AWSCodePipelineServiceRole')
    });

    // Declare source code as an artifact
    const sourceOutput = new codepipeline.Artifact();

    // Add source stage to pipeline
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'Source',
          repository: codeRepo,
          output: sourceOutput,
          branch: 'master',
          trigger: CodeCommitTrigger.EVENTS
        })
      ]
    });

    // Declare build output as artifacts
    const buildOutput = new codepipeline.Artifact();

    // Declare a new CodeBuild project
    const buildProject = new codebuild.PipelineProject(this, 'Build', {
      environment: { buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2 },
      environmentVariables: {
        'PACKAGE_BUCKET': {
          value: artifactsBucket.bucketName
        }
      },
      role: iam.Role.fromRoleArn(this,'CodeBuildServiceRole','arn:aws:iam::357518989200:role/service-role/CodeBuildServiceRole')
    });

    // Add the build stage to our pipeline
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'Build',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Deploy stage
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.CloudFormationCreateReplaceChangeSetAction({
          actionName: 'CreateReplaceChangeSet',
          templatePath: buildOutput.atPath("packaged.yaml"),
          stackName: 'urlshorter-pipeline-stack',
          adminPermissions: false,
          deploymentRole: iam.Role.fromRoleArn(this, 'PipelineDeployRole', 'arn:aws:iam::357518989200:role/PipelineDeployRole'),
          capabilities: [CloudFormationCapabilities.ANONYMOUS_IAM,CloudFormationCapabilities.AUTO_EXPAND],
          changeSetName: 'urlshorter-deploy-changeset',
          runOrder: 1
        }),
        new codepipeline_actions.CloudFormationExecuteChangeSetAction({
          actionName: 'ExecuteChangeSet',
          stackName: 'urlshorter-pipeline-stack',
          changeSetName: 'urlshorter-deploy-changeset',
          runOrder: 2
        }),
      ],
    });

  }
}
