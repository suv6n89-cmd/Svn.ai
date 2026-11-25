const chat = document.querySelector("#chat");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
const status = document.querySelector("#status");

function add(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}
function replyTo(message) {
  const m = message.toLowerCase();
  if (m.includes("মনে") || m.includes("মেমোরি")) {
    return "এখন Demo Mode-এ আমি এই ব্রাউজারের চলতি চ্যাট দেখতে পারি। স্থায়ী ও নিরাপদ Personal Memory পরের ধাপে যোগ করব।";
  }
  if (m.includes("কাজের তালিকা") || m.includes("আজকের কাজ")) {
    return "আজকের সহজ কাজের তালিকা:\n১. সবচেয়ে জরুরি কাজটি আগে করো।\n২. প্রয়োজনীয় ফোন/মেসেজ শেষ করো।\n৩. ২০ মিনিট নতুন কিছু শেখো।\n৪. দিনের শেষে কাজগুলো যাচাই করো।";
  }
  if (m.includes("ইংরেজি")) {
    return "প্রতিদিন ২০ মিনিট:\n১. ৫টি নতুন শব্দ শেখো।\n২. ৫টি ছোট বাক্য বলার অনুশীলন করো।\n৩. ৫ মিনিট ইংরেজি শোনো।\n৪. নিজের পরিচয় ইংরেজিতে বলো।";
  }
  if (m.includes("হ্যালো") || m.includes("hello") || m.includes("সালাম")) {
    return "ওয়ালাইকুম আসসালাম! 😊 বলো, কী সাহায্য লাগবে?";
  }
  return "তোমার কথাটি পেয়েছি। তবে আমি এখন প্রাথমিক Demo Mode-এ আছি, তাই ইন্টারনেটভিত্তিক AI উত্তর দিতে পারছি না। পরের ধাপে নিরাপদ AI API যুক্ত করব।";
}
function send(message) {
  const clean = message.trim();
  if (!clean) return;
  add(clean, "user");
  input.value = "";
  setTimeout(() => {
    const answer = replyTo(clean);
    add(answer, "bot");
    if ("speechSynthesis" in window) {
      // Voice reply is optional; only speak if the user has enabled it.
      if (localStorage.getItem("svn_voice") === "on") {
        const utter = new SpeechSynthesisUtterance(answer);
        utter.lang = "bn-BD";
        speechSynthesis.speak(utter);
      }
    }
  }, 250);
}
form.addEventListener("submit", e => { e.preventDefault(); send(input.value); });
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => send(b.dataset.prompt)));
document.querySelector("#clear").addEventListener("click", () => {
  chat.innerHTML = "";
  add("চ্যাট পরিষ্কার করা হয়েছে। আবার শুরু করি!", "bot");
});
const mic = document.querySelector("#mic");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  mic.addEventListener("click", () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    recognition.onstart = () => status.textContent = "শুনছি... কথা বলো";
    recognition.onresult = e => { input.value = e.results[0][0].transcript; send(input.value); };
    recognition.onerror = () => status.textContent = "মাইক্রোফোন কাজ করেনি; অনুমতি ও ব্রাউজার পরীক্ষা করো";
    recognition.onend = () => status.textContent = "Demo mode · তোমার তথ্য এই ব্রাউজারেই থাকে";
    recognition.start();
  });
} else {
  mic.addEventListener("click", () => alert("এই ব্রাউজারে Voice Input সমর্থিত নয়। Chrome দিয়ে চেষ্টা করো।"));
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
