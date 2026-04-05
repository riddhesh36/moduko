import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(envFile.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => l.split('=')));

const url = env['VITE_SUPABASE_URL'];
const key = env['VITE_SUPABASE_ANON_KEY'];
if (!url || !key) {
    console.error("Missing URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
    if (ordersError) console.error("Orders Error:", ordersError);
    else console.log("Orders count (anonymous):", orders?.length);
    if (orders?.length > 0) console.log(orders.slice(0, 2));

    const { data: slots, error: slotsError } = await supabase.from('slots').select('*');
    if (slotsError) console.error("Slots Error:", slotsError);
    else console.log("Slots count:", slots?.length);
}

run();
