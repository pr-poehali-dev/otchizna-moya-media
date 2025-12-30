import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    '''Получение подключения к базе данных'''
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor
    )

def handler(event: dict, context) -> dict:
    '''API для работы с аудио и видео контентом'''
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            content_type = params.get('type', 'audio')
            
            if content_type == 'audio':
                cursor.execute('''
                    SELECT id, title, author, description, duration, audio_url, created_at 
                    FROM t_p98106398_otchizna_moya_media.audio_content 
                    ORDER BY created_at DESC
                ''')
            else:
                cursor.execute('''
                    SELECT id, title, description, duration, video_url, thumbnail_url, created_at 
                    FROM t_p98106398_otchizna_moya_media.video_content 
                    ORDER BY created_at DESC
                ''')
            
            items = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps([dict(item) for item in items], default=str),
                'isBase64Encoded': False
            }

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            content_type = body.get('contentType')
            
            if content_type == 'audio':
                cursor.execute('''
                    INSERT INTO t_p98106398_otchizna_moya_media.audio_content 
                    (title, author, description, duration, audio_url) 
                    VALUES (%s, %s, %s, %s, %s) 
                    RETURNING id
                ''', (
                    body.get('title'),
                    body.get('author'),
                    body.get('description'),
                    body.get('duration'),
                    body.get('audioUrl')
                ))
            else:
                cursor.execute('''
                    INSERT INTO t_p98106398_otchizna_moya_media.video_content 
                    (title, description, duration, video_url, thumbnail_url) 
                    VALUES (%s, %s, %s, %s, %s) 
                    RETURNING id
                ''', (
                    body.get('title'),
                    body.get('description'),
                    body.get('duration'),
                    body.get('videoUrl'),
                    body.get('thumbnailUrl')
                ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'id': result['id']}),
                'isBase64Encoded': False
            }

        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            content_id = params.get('id')
            content_type = params.get('type', 'audio')
            
            if not content_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing id parameter'}),
                    'isBase64Encoded': False
                }
            
            if content_type == 'audio':
                cursor.execute(
                    'DELETE FROM t_p98106398_otchizna_moya_media.audio_content WHERE id = %s',
                    (content_id,)
                )
            else:
                cursor.execute(
                    'DELETE FROM t_p98106398_otchizna_moya_media.video_content WHERE id = %s',
                    (content_id,)
                )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }

        cursor.close()
        conn.close()

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
