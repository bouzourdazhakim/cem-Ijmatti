/**
 * ====================================================================
 *  إعدادات المزامنة والتكوين الدائم لمتوسطة بني جماتي (Vercel & Cloud Config)
 *  CEM BENI JMATTI - GLOBAL CLOUD CONFIGURATION
 * ====================================================================
 */

window.CEM_CONFIG = {
    // تحديد المزود السحابي الافتراضي: 'cloudinary' (مستحسن) أو 'pantry' أو 'kvdb' أو 'jsonbin'
    cloudProvider: "cloudinary",

    // 1. إعدادات Pantry.dev (مجاني تماماً - سعة 10MB لكل سلة)
    // سجل في getpantry.cloud واحصل على معرف Pantry ID الخاص بك
    pantryId: "",
    pantryBasket: "cem_site_data",

    // 2. إعدادات KVDB.io (مجاني - سعة 16KB لكل مفتاح)
    // إنشاء Bucket جديد:  Invoke-WebRequest -Uri "https://kvdb.io" -Method Post -Body "email=you@email.com"
    // الناتج هو معرف Bucket مثل: Fd55uogXyxYdnXJvnyN8Xo (يجب وضعه أدناه - لا تختاره عشوائياً)
    kvdbBucketId: "UF5p2KQFG3VsMJcPVfE7Nv",
    kvdbKey: "cem_site_data",

    // 3. إعدادات JSONbin.io (المزود القديم)
    jsonbinId: "6a764adcda38895dfec7dfe2",
    jsonbinMasterKey: "$2a$10$3UR9kGJm1FmhsjHAQ9/l/uI1aYxKJmwycjGTq2qs9/NAZVmV/qO6u",

    // 4. إعدادات رفع الصور الفوري عبر ImgBB API
    imgbbApiKey: "9e1ce2595a4aaec35807c37067f327ba",

    // 5. إعدادات استضافة الملفات والصور عبر Cloudinary (بديل GitHub - مجاني 25GB)
    //    يستخدم أيضاً كمزود مزامنة بيانات الموقع (بدون أي حساب إضافي)
    //    سجّل على cloudinary.com واحصل على Cloud Name وأنشئ Upload Preset من الإعدادات
    cloudinaryName: "dindawysv",
    cloudinaryPreset: "cem_preset",
    // مفاتيح API الخاصة بالرفع الموقّع (الكتابة فوق الملف الموجود) - من Dashboard → Settings → API Keys
    cloudinaryApiKey: "875188511396798",
    cloudinaryApiSecret: "4QN4aLaGJY2k4P92ICYixjFFT-Y",

    // 6. كلمة مرور لوحة التحكم الخاصة بالمؤسسة
    adminPassword: "admin123",

    // 7. روابط الاتصال والفضاء الرقمي للأولياء
    awliyaUrl: "https://awlyaa.education.dz/",
    facebookUrl: "https://web.facebook.com/hbouzourdaz121",
    twitterUrl: "",
    youtubeUrl: ""
};

/**
 * ====================================================================
 * وظائف المزامنة السحابية الموحدة لجميع صفحات البوابة
 * ====================================================================
 */

// دالة SHA-1 مدمجة لتوقيع طلبات Cloudinary الموقّعة (بدون أي مكتبات خارجية)
window.cemSha1 = function(msg) {
    function rol(x, n) { return (x << n) | (x >>> (32 - n)); }
    function toHex(x) { x = x >>> 0; var s = x.toString(16); while (s.length < 8) s = '0' + s; return s; }
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    var str = unescape(encodeURIComponent(msg));
    var bytes = [];
    for (var i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i) & 0xff;
    var bitlen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0x00);
    var hi = Math.floor(bitlen / 0x100000000), lo = bitlen >>> 0;
    for (var j = 0; j < 4; j++) bytes.push((hi >>> (24 - 8 * j)) & 0xff);
    for (var j = 0; j < 4; j++) bytes.push((lo >>> (24 - 8 * j)) & 0xff);
    var W = [];
    var nWords = bytes.length / 4;
    for (i = 0; i < nWords; i++) {
        W[i] = (bytes[i * 4] << 24) | (bytes[i * 4 + 1] << 16) | (bytes[i * 4 + 2] << 8) | bytes[i * 4 + 3];
    }
    var a, b, c, d, e, f, k, t;
    for (var blk = 0; blk < nWords / 16; blk++) {
        var w = W.slice(blk * 16, blk * 16 + 16);
        for (var n = 16; n < 80; n++) {
            t = w[n - 3] ^ w[n - 8] ^ w[n - 14] ^ w[n - 16];
            w[n] = rol(t, 1);
        }
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4];
        for (n = 0; n < 80; n++) {
            if (n < 20) { f = (b & c) | (~b & d); k = K[0]; }
            else if (n < 40) { f = b ^ c ^ d; k = K[1]; }
            else if (n < 60) { f = (b & c) | (b & d) | (c & d); k = K[2]; }
            else { f = b ^ c ^ d; k = K[3]; }
            t = (rol(a, 5) + f + e + k + w[n]) | 0;
            e = d; d = c; c = rol(b, 30); b = a; a = t;
        }
        H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0;
    }
    return toHex(H[0]) + toHex(H[1]) + toHex(H[2]) + toHex(H[3]) + toHex(H[4]);
};

// شاشة تحميل تُعرض قبل جلب بيانات السحابة حتى لا تظهر البيانات القديمة لحظة تحديث الصفحة
// (تعيد استخدام غطاء HTML الثابت الموجود في بداية body إن وُجد لتفادي أي وميض)
window.showCemLoading = function(text) {
    var el = document.getElementById('cem-loading-overlay');
    if (!el) {
        el = document.createElement('div');
        el.id = 'cem-loading-overlay';
        el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fdf8ee;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-family:"Cairo","Segoe UI",sans-serif;direction:rtl;';
        el.innerHTML =
            '<div style="width:58px;height:58px;border:5px solid #f5d9a8;border-top-color:#1b4332;border-radius:50%;animation:cemSpin .9s linear infinite;"></div>' +
            '<div data-cem-label style="color:#1b4332;font-size:15px;font-weight:800;">جاري تحميل البيانات...</div>' +
            '<style>@keyframes cemSpin{to{transform:rotate(360deg)}}</style>';
        document.body.appendChild(el);
    } else {
        el.style.display = 'flex';
    }
    if (text) {
        var lbl = el.querySelector('[data-cem-label]');
        if (lbl) lbl.textContent = text;
    }
};
window.hideCemLoading = function() {
    var el = document.getElementById('cem-loading-overlay');
    if (el) el.style.display = 'none';
};

// جلب البيانات من السحابة بناءً على المزود المختار
// (مع تراجع تلقائي إلى المزود الافتراضي في config.js إن كان إعداد localStorage قديماً)
window.cemCloudFetch = async function(localData) {
    const settings = localData?.settings || {};
    const globalCfg = window.CEM_CONFIG || {};
    const settingsProvider = settings.cloudProvider || '';
    const configProvider = globalCfg.cloudProvider || 'jsonbin';
    const candidates = (settingsProvider && settingsProvider !== configProvider)
        ? [settingsProvider, configProvider]
        : [settingsProvider || configProvider];

    for (const provider of candidates) {
        const result = await cemCloudFetchFrom(provider, settings, globalCfg);
        if (result) return result;
    }
    return null;
};

async function cemCloudFetchFrom(provider, settings, globalCfg) {
    if (provider === 'pantry') {
        const pantryId = settings.pantryId || globalCfg.pantryId;
        const basketName = settings.pantryBasket || globalCfg.pantryBasket || 'cem_site_data';
        if (!pantryId) return null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
            const res = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`, {
                cache: 'no-cache',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.error("Pantry Fetch Error:", e);
        }
    } else if (provider === 'kvdb') {
        const bucketId = settings.kvdbBucketId || globalCfg.kvdbBucketId;
        const key = settings.kvdbKey || globalCfg.kvdbKey || 'cem_site_data';
        if (!bucketId) return null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
            const res = await fetch(`https://kvdb.io/${bucketId}/${key}`, {
                cache: 'no-cache',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.error("KVDB Fetch Error:", e);
        }
    } else if (provider === 'cloudinary') {
        const cloudName = settings.cloudinaryName || globalCfg.cloudinaryName;
        if (!cloudName) return null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
            // cache: 'no-cache' يجبر المتصفح على إعادة التحقق من السيرفر كل مرة
            // بدلاً من استخدام نسخته القديمة لمدة 30 يوماً (Cache-Control: max-age)
            const res = await fetch(`https://res.cloudinary.com/${cloudName}/raw/upload/cem_site_data.json`, {
                cache: 'no-cache',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.error("Cloudinary Fetch Error:", e);
        }
    } else {
        // Legacy JSONbin
        const binId = settings.binId || globalCfg.jsonbinId;
        const masterKey = settings.masterKey || globalCfg.jsonbinMasterKey;
        if (!binId || !masterKey) return null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
            const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
                headers: { 'X-Master-Key': masterKey },
                cache: 'no-cache',
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (res.ok) {
                const j = await res.json();
                return j.record || null;
            }
        } catch (e) {
            console.error("JSONbin Fetch Error:", e);
        }
    }
    return null;
};

// حفظ البيانات ومزامنتها سحابياً بناءً على المزود المختار
// (مع تراجع تلقائي إلى المزود الافتراضي في config.js إن كان إعداد localStorage قديماً)
window.cemCloudSave = async function(currentData) {
    const settings = currentData?.settings || {};
    const globalCfg = window.CEM_CONFIG || {};
    const settingsProvider = settings.cloudProvider || '';
    const configProvider = globalCfg.cloudProvider || 'jsonbin';
    const candidates = (settingsProvider && settingsProvider !== configProvider)
        ? [settingsProvider, configProvider]
        : [settingsProvider || configProvider];

    let lastError = null;
    for (const provider of candidates) {
        try {
            return await cemCloudSaveTo(provider, currentData, settings, globalCfg);
        } catch (e) {
            console.error(provider + " Save Error:", e);
            lastError = e;
        }
    }
    if (lastError) throw lastError;
    return false;
};

async function cemCloudSaveTo(provider, currentData, settings, globalCfg) {
    if (provider === 'pantry') {
        const pantryId = settings.pantryId || globalCfg.pantryId;
        const basketName = settings.pantryBasket || globalCfg.pantryBasket || 'cem_site_data';
        if (!pantryId) throw new Error("مُعرف السلة (Pantry ID) مفقود! يرجى إدخاله في الإعدادات.");

        const res = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${basketName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentData)
        });
        return res.ok;
    } else if (provider === 'kvdb') {
        const bucketId = settings.kvdbBucketId || globalCfg.kvdbBucketId;
        const key = settings.kvdbKey || globalCfg.kvdbKey || 'cem_site_data';
        if (!bucketId) throw new Error("مُعرف Bucket ID الخاص بـ KVDB مفقود! يرجى إدخاله في الإعدادات.");

        const res = await fetch(`https://kvdb.io/${bucketId}/${key}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentData)
        });
        return res.ok;
    } else if (provider === 'cloudinary') {
        const cloudName = settings.cloudinaryName || globalCfg.cloudinaryName;
        const apiKey = settings.cloudinaryApiKey || globalCfg.cloudinaryApiKey;
        const apiSecret = settings.cloudinaryApiSecret || globalCfg.cloudinaryApiSecret;
        if (!cloudName || !apiKey || !apiSecret) throw new Error("إعدادات Cloudinary ناقصة! يجب تعبئة Cloud Name + API Key + API Secret (من Dashboard → Settings → API Keys) لتمكين الكتابة فوق الملف.");

        const timestamp = Math.floor(Date.now() / 1000);
        const signedParams = [
            ['invalidate', 'true'],
            ['overwrite', 'true'],
            ['public_id', 'cem_site_data'],
            ['timestamp', String(timestamp)]
        ].sort((x, y) => (x[0] < y[0] ? -1 : 1));
        const signature = window.cemSha1(signedParams.map(p => p[0] + '=' + p[1]).join('&') + apiSecret);

        const formData = new FormData();
        formData.append('file', new Blob([JSON.stringify(currentData)], { type: 'application/json' }), 'cem_site_data.json');
        formData.append('public_id', 'cem_site_data');
        formData.append('overwrite', 'true');
        formData.append('invalidate', 'true');
        formData.append('timestamp', String(timestamp));
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody && errBody.error ? errBody.error.message : ('HTTP ' + res.status));
            }
            return true;
        } catch (e) {
            clearTimeout(timeout);
            console.error("Cloudinary Save Error:", e);
            throw e;
        }
    } else {
        // Legacy JSONbin
        const binId = settings.binId || globalCfg.jsonbinId;
        const masterKey = settings.masterKey || globalCfg.jsonbinMasterKey;
        if (!binId || !masterKey) throw new Error("مفاتيح الاتصال بـ JSONbin مفقودة!");

        const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': masterKey
            },
            body: JSON.stringify(currentData)
        });
        return res.ok;
    }
};
