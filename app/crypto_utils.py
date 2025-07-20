# app/crypto_utils.py

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.exceptions import InvalidSignature
import base64
import json

def generate_key_pair():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ).decode("utf-8")

    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode("utf-8")

    return private_pem, public_pem

def sign_hashes(hashes, private_key_pem):
    private_key = serialization.load_pem_private_key(private_key_pem.encode(), password=None)

    message = json.dumps(hashes).encode()
    signature = private_key.sign(
        message,
        padding.PKCS1v15(),
        hashes.SHA256()
    )

    return base64.b64encode(signature).decode()

def verify_signature(input_hashes, signed_hashes, signature_b64, public_key_pem):
    public_key = serialization.load_pem_public_key(public_key_pem.encode())
    signature = base64.b64decode(signature_b64)

    # Prepare signed message
    message = json.dumps(signed_hashes).encode()

    try:
        public_key.verify(
            signature,
            message,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        # Fuzzy match hashes
        matched = sum(1 for a, b in zip(input_hashes, signed_hashes) if a == b)
        match_percent = matched / len(signed_hashes) * 100
        return True, match_percent
    except InvalidSignature:
        return False, 0.0
