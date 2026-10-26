import os
import sys
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def send_head(self):
        if 'Range' not in self.headers:
            self.range = None
            return super().send_head()

        range_header = self.headers['Range']
        match = re.match(r'^bytes=(\d*)-(\d*)$', range_header)
        if not match:
            self.range = None
            return super().send_head()

        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.range = None
            return super().send_head()

        file_size = os.path.getsize(path)
        start, end = match.groups()
        start = int(start) if start else 0
        end = int(end) if end else file_size - 1

        if start >= file_size or end >= file_size or start > end:
            self.send_error(416, 'Requested Range Not Satisfiable')
            return None

        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()

        f = open(path, 'rb')
        f.seek(start)
        self.range = (start, end)
        return f

    def copyfile(self, source, outputfile):
        if not getattr(self, 'range', None):
            return super().copyfile(source, outputfile)
        start, end = self.range
        bytes_to_send = end - start + 1
        chunk_size = 64 * 1024
        while bytes_to_send > 0:
            read_size = min(bytes_to_send, chunk_size)
            data = source.read(read_size)
            if not data:
                break
            outputfile.write(data)
            bytes_to_send -= len(data)

if __name__ == '__main__':
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, RangeRequestHandler)
    print(f'Range-capable HTTP Server running on http://localhost:{port}')
    httpd.serve_forever()
