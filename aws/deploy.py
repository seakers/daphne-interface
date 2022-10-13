import os
import json
import boto3
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('/app/.env')


"""
    This module commits prod build to s3 bucket
"""
dist_path = '/app/dist'
asset_path = '/app/dist/assets'

def commit():
    client = boto3.client('s3', region_name='us-east-2')

    bucket_path = ''
    for root,dirs,files in os.walk(dist_path):
        remote_dirs = list(Path(root).parts[3:])
        for file in files:
            local_path = os.path.join(root, file)
            remote_path = file
            if len(remote_dirs) > 0:
                remote_path = os.path.join(*remote_dirs, remote_path)

            content_type = 'text/html'
            file_type = os.path.splitext(file)[1][1:]
            print(file_type)
            if file_type == 'html':
                content_type = 'text/html'
            elif file_type == 'css':
                content_type = 'text/css'
            elif file_type == 'js':
                content_type = 'text/js'
            elif file_type == 'svg':
                content_type = 'image/svg'

            print('--> COPY:', remote_path, content_type)
            # client.upload_file(local_path, 'daphne-dev-bucket', remote_path, ExtraArgs={"ContentType": content_type})
            client.upload_file(local_path, 'daphne-dev-bucket.selva-research.com', remote_path, ExtraArgs={"ContentType": content_type})

    return 0


if __name__ == "__main__":
    commit()




