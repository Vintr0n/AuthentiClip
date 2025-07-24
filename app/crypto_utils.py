import hashlib
import os
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

# --------------------------- PASSWORD UTILS ----------------------------

def hash_password(password: str, salt: bytes = None) -> str:
    if not salt:
        salt = os.urandom(16)
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
    return f"{salt.hex()}:{hash_obj.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    salt_hex, hash_hex = hashed.split(":")
    salt = bytes.fromhex(salt_hex)
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100_000)
    return new_hash.hex() == hash_hex

# --------------------------- KEY UTILS ----------------------------

def generate_key_pair():
    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    private_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption()
    )

    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )

    return private_bytes, public_bytes

def sign_data(private_key_bytes: bytes, data: bytes) -> bytes:
    private_key = Ed25519PrivateKey.from_private_bytes(private_key_bytes)
    return private_key.sign(data)

def verify_signature(data: bytes, signature: bytes, public_key_bytes: bytes) -> bool:
    try:
        public_key = Ed25519PublicKey.from_public_bytes(public_key_bytes)
        public_key.verify(signature, data)
        return True
    except InvalidSignature:
        return False
