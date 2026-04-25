#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const MARKER_VERSION = 1;
const MARKER_PATH = path.join(process.cwd(), 'node_modules', '.sillybunny-dependencies.json');
const STATE_FILES = [
    'package.json',
    'bun.lock',
    'package-lock.json',
];

function hashFileState(profile) {
    const hash = crypto.createHash('sha256');
    hash.update(`version:${MARKER_VERSION}\n`);
    hash.update(`profile:${profile}\n`);
    hash.update(`node_env:${process.env.NODE_ENV || ''}\n`);

    for (const file of STATE_FILES) {
        const filePath = path.join(process.cwd(), file);
        hash.update(`file:${file}\n`);

        if (!fs.existsSync(filePath)) {
            hash.update('missing\n');
            continue;
        }

        hash.update(fs.readFileSync(filePath));
        hash.update('\n');
    }

    return hash.digest('hex');
}

function readMarker() {
    try {
        return JSON.parse(fs.readFileSync(MARKER_PATH, 'utf8'));
    } catch {
        return { version: MARKER_VERSION, profiles: {} };
    }
}

function writeMarker(marker) {
    fs.mkdirSync(path.dirname(MARKER_PATH), { recursive: true });
    fs.writeFileSync(`${MARKER_PATH}.tmp`, `${JSON.stringify(marker, null, 4)}\n`);
    fs.renameSync(`${MARKER_PATH}.tmp`, MARKER_PATH);
}

function getRuntimeVersion(profile) {
    if (profile.startsWith('bun')) {
        return globalThis.Bun?.version || '';
    }

    if (profile.startsWith('node')) {
        return process.versions.node || '';
    }

    return '';
}

function getCurrentState(profile) {
    return {
        hash: hashFileState(profile),
        runtimeVersion: getRuntimeVersion(profile),
        markedAt: new Date().toISOString(),
    };
}

function needsInstall(profile) {
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
        return 'node_modules is missing';
    }

    if (!fs.existsSync(path.join(process.cwd(), 'config.yaml'))) {
        return 'config.yaml is missing';
    }

    const marker = readMarker();
    const expectedHash = hashFileState(profile);
    const profileState = marker?.profiles?.[profile];

    if (marker.version !== MARKER_VERSION || !profileState || profileState.hash !== expectedHash) {
        return 'dependency state changed';
    }

    return '';
}

function markInstalled(profile) {
    const marker = readMarker();
    marker.version = MARKER_VERSION;
    marker.profiles = marker.profiles || {};
    marker.profiles[profile] = getCurrentState(profile);
    writeMarker(marker);
}

function printUsage() {
    console.error('Usage: dependency-state.js <check|mark> <profile>');
}

const [command, profile] = process.argv.slice(2);

if (!command || !profile) {
    printUsage();
    process.exit(2);
}

if (command === 'check') {
    const reason = needsInstall(profile);

    if (reason) {
        if (process.env.SILLYBUNNY_DEPENDENCY_DEBUG) {
            console.log(`Dependency install required: ${reason}.`);
        }

        process.exit(1);
    }

    process.exit(0);
}

if (command === 'mark') {
    markInstalled(profile);
    process.exit(0);
}

printUsage();
process.exit(2);
