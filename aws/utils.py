import os
import boto3


def get_client(service):
    client = boto3.client(service,
        region_name='us-east-2',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    return client