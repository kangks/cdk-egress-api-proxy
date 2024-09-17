import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EgressApiProxyVpcEndpointConstruct } from '../lib/EgressApiProxyVpcEndpointConstruct';
import { App, Stack } from 'aws-cdk-lib';
import { EgressApiProxyConstructProps } from '../lib/EgressApiProxyConstructProps';

test('EgressApiProxyVpcEndpointConstruct creates necessary resources', () => {
  const stack = new Stack(new App(), "Test", {env: {
    account: "123456",
    region: "us-east-1",
    }}
  );
  
  const props: EgressApiProxyConstructProps = {
    vpcId: 'vpc-123456',
    subnets: [{ avaialbilityZone: 'us-east-1a', subnetId: 'subnet-123456' }],
    CidrAPIcallee: '0.0.0.0/0'
  };

  // Instantiate EgressApiProxyVpcEndpointConstruct
  new EgressApiProxyVpcEndpointConstruct(stack, 'TestEgressApiProxyVpcEndpoint', props);

  // Create template from stack
  const template = Template.fromStack(stack);

  // Assertions
  template.resourceCountIs('AWS::EC2::VPCEndpoint', 1);
  template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
  template.hasResourceProperties('AWS::EC2::VPCEndpoint', {
    ServiceName: 'com.amazonaws.us-east-1.execute-api'
  });
  template.hasResourceProperties('AWS::EC2::SecurityGroup', {
    SecurityGroupIngress: [{},{}],
  });
});
