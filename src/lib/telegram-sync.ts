/**
 * TELEGRAM SYNC ENGINE FOR CODECRAFT & SUKU
 * Dispatches real-time training pairs, generated app codes, and notifications
 * to Telegram bot / channel.
 */

import fs from 'fs';
import path from 'path';

interface TelegramConfig {
    bot_token?: string;
    chat_id?: string;
    enabled?: boolean;
    notify_on_new_sample?: boolean;
}

const CONFIG_PATH = path.join(process.cwd(), 'training', 'telegram_config.json');

export function getTelegramConfig(): TelegramConfig {
    let config: TelegramConfig = {
        bot_token: process.env.TELEGRAM_BOT_TOKEN || '',
        chat_id: process.env.TELEGRAM_CHAT_ID || '',
        enabled: true,
        notify_on_new_sample: true,
    };

    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
            const parsed = JSON.parse(raw);
            if (!config.bot_token && parsed.bot_token) config.bot_token = parsed.bot_token;
            if (!config.chat_id && parsed.chat_id) config.chat_id = parsed.chat_id;
            if (parsed.enabled !== undefined) config.enabled = parsed.enabled;
            if (parsed.notify_on_new_sample !== undefined) config.notify_on_new_sample = parsed.notify_on_new_sample;
        } catch (e) {
            console.warn('[TelegramSync] Config parse error:', e);
        }
    }

    return config;
}

export async function sendTelegramAppNotification(
    prompt: string,
    appCode: string,
    sampleId?: string,
    category: string = 'app_generation'
): Promise<boolean> {
    const config = getTelegramConfig();
    if (!config.enabled || !config.bot_token || !config.chat_id) {
        return false;
    }

    const id = sampleId || `suku_${Date.now()}`;
    const lines = appCode.split('\n').length;
    const bytes = appCode.length;

    const message = `✨ <b>New CodeCraft Training Sample Generated!</b>\n━━━━━━━━━━━━━━━━━━━━\n🆔 <b>ID:</b> <code>${id}</code>\n🏷️ <b>Category:</b> <code>${category}</code>\n💬 <b>Prompt:</b>\n<i>"${escapeHtml(prompt)}"</i>\n\n📊 <b>Code Size:</b> ${bytes.toLocaleString()} bytes (${lines.toLocaleString()} lines)\n🕒 <b>Time:</b> ${new Date().toLocaleString()}\n━━━━━━━━━━━━━━━━━━━━\n🚀 <i>App trained and saved to local neural dataset.</i>`;

    try {
        const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: config.chat_id,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }),
        });
        return true;
    } catch (err) {
        console.warn('[TelegramSync] Failed to send Telegram notification:', err);
        return false;
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
