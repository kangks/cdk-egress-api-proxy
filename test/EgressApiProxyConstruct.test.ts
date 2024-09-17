import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EgressApiProxyConstruct, EgressApiProxyConstructProps } from '../lib/EgressApiProxyConstruct';
import { Stack } from 'aws-cdk-lib';

test('EgressApiProxyConstruct creates necessary resources', () => {
  const stack = new Stack();
  
  const props: EgressApiProxyConstructProps = {
    vpcId: 'vpc-123456',
    subnets: [{ avaialbilityZone: 'us-east-1a', subnetId: 'subnet-123456' }],
    CidrAPIcallee: '0.0.0.0/0',
  };

  // Instantiate EgressApiProxyConstruct
  new EgressApiProxyConstruct(stack, 'TestEgressApiProxy', props);

  // Create template from stack
  const template = Template.fromStack(stack);

  // Assertions
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
  template.resourceCountIs('AWS::Logs::LogGroup', 1);
  template.hasResourceProperties('AWS::ApiGateway::RestApi', {
    Name: 'TestEgressApiProxy-RestApi'
  });
  template.hasResourceProperties('AWS::ApiGateway::Method', {
    HttpMethod: 'POST'
  });
});
