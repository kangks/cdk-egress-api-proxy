import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EgressApiProxyConstructProps } from './EgressApiProxyConstructProps';

export class EgressApiProxyVpcEndpointConstruct extends Construct {

  private props: EgressApiProxyConstructProps;
  private id: string;

  constructor(scope: Construct, id: string, props: EgressApiProxyConstructProps) {
    super(scope, id);

    let subnets = Array();

    let vpc = cdk.aws_ec2.Vpc.fromLookup(this, `${id}-PrimaryVPC`, {
      vpcId: props.vpcId
    });

    for(let i=0; i<props.subnets.length; i++){
      let subnet=props.subnets[i];
      let s = cdk.aws_ec2.Subnet.fromSubnetAttributes(this, `${id}-${subnet.avaialbilityZone}-Subnet`, {
        availabilityZone: subnet.avaialbilityZone,
        subnetId: subnet.subnetId
      });
      subnets.push(s);
    };

    const securitygroup = new cdk.aws_ec2.SecurityGroup(this, `${id}-SecurityGroup`, {
      vpc,
      allowAllOutbound: true,
      securityGroupName: 'VpcEndpoint'
    });

    securitygroup.addIngressRule(cdk.aws_ec2.Peer.ipv4(props.CidrAPIcallee), cdk.aws_ec2.Port.tcp(443))    

    const vpcEndpoint = new cdk.aws_ec2.InterfaceVpcEndpoint(this, `${id}-ApiVpcEndpoint`, {
      vpc,
      service: {
        name: `com.amazonaws.${props.env?.region??"us-east-1"}.execute-api`,
        port: 443
      },
      subnets: {
        subnets: subnets
      },
      // privateDnsEnabled: true,
      securityGroups: [securitygroup]
    })    
  }
}
