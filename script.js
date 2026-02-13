let retryUsed = sessionStorage.getItem("retryUsed") === "1";
//
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbw3cmVFVKlU2umR0A88ER1w43XuusjWN4vmXOtWZPio7oMsAmz-LngLiGuVmfykw3M/exec";

function submitQuiz() {
  const totalQuestions = 20;
  const passPercent = 75;

  const company = (document.getElementById("company")?.value || "").trim();
  const name = (document.getElementById("username")?.value || "").trim();

  if (!company) return alert("Албан байгууллагаа бичнэ үү.");
  if (!name) return alert("Нэрээ бичнэ үү.");

  for (let i = 1; i <= totalQuestions; i++) {
    const ans = document.querySelector(`input[name="q${i}"]:checked`);
    if (!ans) return alert(`Асуулт ${i} дутуу байна. Бүгдэд нь хариулна уу.`);
  }

  let score = 0;
  for (let i = 1; i <= totalQuestions; i++) {
    const ans = document.querySelector(`input[name="q${i}"]:checked`);
    score += Number(ans.value); // зөв = 1, буруу = 0
  }

  const percent = Math.round((score / totalQuestions) * 100);
  const passed = percent >= passPercent;

  const resultDiv = document.getElementById("result");
  if (passed) {
    resultDiv.className = "result-pass";
    resultDiv.innerHTML =
      `🎉 Баяр хүргэе, <b>${name}</b>!<br>` +
      `Та <b>${score}/${totalQuestions}</b> буюу <b>${percent}%</b> авч <b>ТЭНЦЛЭЭ</b>.`;
  } else {
  resultDiv.className = "result-fail";

  if (!retryUsed) {
    resultDiv.innerHTML =
      `❌ Уучлаарай, <b>${name}</b>.<br>` +
      `Та <b>${score}/${totalQuestions}</b> буюу <b>${percent}%</b> авч <b>ТЭНЦСЭНГҮЙ</b>.<br><br>` +
      `<button type="button" onclick="retryQuiz()">🔄 Дахин өгөх (1 удаа)</button>`;
  } else {
    resultDiv.innerHTML =
      `❌ Уучлаарай, <b>${name}</b>.<br>` +
      `Та <b>${score}/${totalQuestions}</b> буюу <b>${percent}%</b> авч <b>ТЭНЦСЭНГҮЙ</b>.<br><br>` +
      `⛔ Дахин өгөх эрх дууссан.`;
  }
}


  const form = new URLSearchParams();
  form.append("company", company);
  form.append("name", name);
  form.append("score", String(score));
  form.append("percent", String(percent));
  form.append("result", passed ? "ТЭНЦСЭН" : "ТЭНЦЭЭГҮЙ");

  // form.append("ua", navigator.userAgent);

  fetch(WEB_APP_URL, {
    method: "POST",
    body: form,
    // headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    redirect: "follow",
  })
    .then((res) => res.text())
    .then((txt) => console.log("Sheets response:", txt))
    .catch((err) => console.error("Sheets error:", err));
}

function retryQuiz() {
  document.querySelectorAll('input[type="radio"]').forEach((r) => (r.checked = false));
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";
  resultDiv.className = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

