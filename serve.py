"""Ella Boutique preview server — always serves fresh files (no caching)."""
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Revalidate every reload (always fresh), but allow 304
        # Not-Modified responses so repeat loads are near-instant.
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def log_message(self, *args):
        pass

if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8765), NoCacheHandler)
    print("Ella preview: http://localhost:8765/index.html (no-cache)")
    server.serve_forever()
