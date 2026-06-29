import json
import sys
import os
from unittest.mock import MagicMock, patch

# Add the lambda folder to Python path directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'lambda'))

# Now import directly (not "from lambda.counter")
with patch('boto3.resource'):
    import counter

def test_returns_200():
    """Lambda should always return HTTP 200"""
    mock_table = MagicMock()
    mock_table.update_item.return_value = {
        'Attributes': {'count': 42}
    }
    with patch.object(counter, 'table', mock_table):
        result = counter.lambda_handler({}, {})
    assert result['statusCode'] == 200

def test_returns_count():
    """Response body should contain the visitor count"""
    mock_table = MagicMock()
    mock_table.update_item.return_value = {
        'Attributes': {'count': 7}
    }
    with patch.object(counter, 'table', mock_table):
        result = counter.lambda_handler({}, {})
    body = json.loads(result['body'])
    assert body['count'] == 7

def test_cors_header_present():
    """CORS header must be in every response"""
    mock_table = MagicMock()
    mock_table.update_item.return_value = {
        'Attributes': {'count': 1}
    }
    with patch.object(counter, 'table', mock_table):
        result = counter.lambda_handler({}, {})
    assert result['headers']['Access-Control-Allow-Origin'] == '*'