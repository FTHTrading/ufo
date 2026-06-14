// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Simple registry for UFO Anomaly Intelligence Ring releases (deploy to Polygon for EVM compatibility, or adapt to Solana program / XRPL).
// Records: root IPFS CID for site build + manifests, version, publisher, timestamp, content hash for integrity.
// Premium actions can emit events or use this for receipts.

contract UFORegistry {
    struct Release {
        string cid;          // IPFS root CID for the static site + manifests
        bytes32 contentHash; // keccak256 of key assets/manifest for integrity
        address publisher;
        uint256 timestamp;
        string version;      // e.g. "v1.0-pursue-r03"
        string license;
    }

    mapping(bytes32 => Release) public releases; // siteId or releaseId => Release
    event ReleaseRegistered(bytes32 indexed id, string cid, address publisher, uint256 timestamp);

    function registerRelease(bytes32 id, string memory cid, bytes32 contentHash, string memory version, string memory license) public {
        releases[id] = Release(cid, contentHash, msg.sender, block.timestamp, version, license);
        emit ReleaseRegistered(id, cid, msg.sender, block.timestamp);
    }

    function getRelease(bytes32 id) public view returns (Release memory) {
        return releases[id];
    }

    // For payments/proofs: can extend with ERC20 for x402 or events for receipts.
}

// For XRPL: equivalent using XRPL hooks or sidechain.
// For Solana: Anchor program with similar PDA for CID storage.