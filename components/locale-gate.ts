import { LOCALE_STORAGE_KEY } from "@/lib/i18n";

/**
 * Runs in <head> before first paint. The site is static, so there is no server to read Accept-Language.
 * A saved choice wins; otherwise the first browser language decides (es* means Spanish, anything else English).
 * If the page is in the other language it jumps to its twin, keeping query and hash. Without a saved choice a
 * Spanish page is never bounced to English (a shared /es link stays Spanish). Crawlers are skipped so both
 * languages stay indexable.
 */
export const localeGateScript = `(function(){try{
var ua=navigator.userAgent||"";
if(/bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly|whatsapp/i.test(ua))return;
var p=location.pathname;
var onEs=p==="/es"||p.indexOf("/es/")===0;
var want=null;
try{want=localStorage.getItem("${LOCALE_STORAGE_KEY}")}catch(e){}
if(want!=="es"&&want!=="en"){
var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||"en"];
/* Browser language only moves Spanish browsers to Spanish. A Spanish link opened by an English browser stays put. */
want=/^es\\b/i.test(String(langs[0]))?"es":(onEs?"es":"en");
}
if(want==="es"&&!onEs){
location.replace((p==="/"?"/es/":"/es"+p)+location.search+location.hash);
}else if(want==="en"&&onEs){
var q=p==="/es"?"/":p.slice(3);
location.replace(q+location.search+location.hash);
}
}catch(e){}})();`;
