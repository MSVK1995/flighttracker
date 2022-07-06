import unittest
import json
from app import app

class UnitestCases(unittest.TestCase):
    
    def test_get_flights_status(self):
        test_obj = app.test_client(self)
        resp = test_obj.get("/opensky_api/flights")
        status_code = resp.status_code
        self.assertEqual(status_code, 400)


    def test_get_flights_data(self):
        test_obj = app.test_client(self)
        resp = test_obj.get("/opensky_api/flights")
        content = json.loads(resp.get_data(as_text=True))
        data_length = len(content)
        self.assertGreater(data_length, 100)
        

if __name__ == '__main__':
    unittest.main()