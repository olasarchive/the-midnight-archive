const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const riddles=[
["I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?","An echo."],
["The more you take from me, the bigger I become. What am I?","A hole."],
["What has many keys but can’t open a single lock?","A piano."],
["What can travel around the world while staying in the same corner?","A stamp."],
["I am not alive, but I grow. I don’t have lungs, but I need air. What am I?","Fire."],
["The more of me there is, the less you can see. What am I?","Darkness."]];
const quotes=["Monsters are not always the creatures hiding in the dark. Sometimes they are the ones who fear the light.","Immortality is not the absence of death, but the burden of endless memory.","Every ancient ruin was once someone’s home.","The oldest stories survive because they contain the oldest fears.","Beware the monster that learns to wear a human smile."];
const chars=[
["Dracula","The immortal Count of Transylvania, inspired by folklore and immortalized by Bram Stoker.","Superhuman strength, shapeshifting, immortality, and command over wolves and bats.",5,"Lord of the Night","I am Dracula."],
["Lestat de Lioncourt","A French nobleman turned vampire, one of the most charismatic and complex immortals in gothic fiction.","Superhuman speed and strength, heightened senses, immortality and a hypnotic presence.",4,"The Brat Prince","Evil is a point of view."],
["Klaus Mikaelson","The first hybrid, born of vampire and werewolf blood, feared by enemies and family alike.","Original vampire powers, werewolf abilities, near invulnerability and centuries of combat experience.",5,"The Original Hybrid",""],
["Elijah Mikaelson","The composed, elegant Original who keeps every promise he makes.","Original vampire strength and speed, near invulnerability, and a reputation for never breaking his word.",5,"The Noble Original","Always and forever."],
["Geralt of Rivia","A witcher trained from childhood to hunt monsters in a world where humans can be worse than beasts.","Master swordsman, enhanced reflexes, alchemy and magical signs.",4,"Master Witcher","Evil is evil. Lesser, greater, middling… it makes no difference."]];
const battles=[
["Klaus Mikaelson vs Lestat de Lioncourt","Two of fiction’s most iconic vampires. Klaus brings the raw power of the Original Hybrid, while Lestat relies on centuries of experience, cunning and supernatural gifts.","Klaus wins in a straight fight, but Lestat is unpredictable enough that nothing is ever certain.",["Klaus","Lestat"]],
["Dracula vs Alucard","A father and son from dark fantasy lore, one the king of the night and the other his greatest enemy.","",["Dracula","Alucard"]]];
const debates=[
["Would you accept immortality?","If you could live forever, would you embrace eternal life, or would the endless years become a burden?",["Accept it","Refuse it"]],
["Are monsters born or made?","Is evil part of someone’s nature, or can pain and circumstance create a monster from an ordinary soul?",["Born","Made"]],
["Feared or respected?","A ruler can be one without the other. Which would you choose to be?",["Feared","Respected"]]];

function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function voteBox(key,opts){
  const box=el("div","votes"),note=el("span","muted");
  const draw=()=>{const c=store.get("vote:"+key,null);
    box.querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",c===i));
    note.textContent=c===null?"Cast your verdict.":"Your verdict is sealed. Tap again to change it."};
  opts.forEach((o,i)=>{const b=el("button",null,o);b.onclick=()=>{store.set("vote:"+key,i);draw()};box.append(b)});
  box.append(note);draw();return box}
function riddleHTML(r){return r[0]+"<details><summary>Reveal the answer</summary><p>"+r[1]+"</p></details>"}

$("#daily").innerHTML=riddleHTML(riddles[Math.floor(Date.now()/864e5)%riddles.length]);
riddles.forEach(r=>$("#riddlelist").append(el("div","row",riddleHTML(r))));
chars.forEach(c=>{const d=el("article","row","<h3>"+c[0]+"</h3><p>"+c[1]+"</p><p><strong>Abilities:</strong> "+c[2]+"</p><p><strong>Power:</strong> <span class='rating' aria-label='"+c[3]+" out of 5'>"+"★".repeat(c[3])+"☆".repeat(5-c[3])+"</span> "+c[4]+"</p>"+(c[5]?"<p class='q'>“"+c[5]+"”</p>":""));$("#chars").append(d)});
battles.forEach((b,i)=>{const d=el("div","row","<h3>"+b[0]+"</h3><p>"+b[1]+"</p>"+(b[2]?"<p><strong>The Archive’s verdict:</strong> "+b[2]+"</p>":"<p class='muted'>The Archive has not ruled on this one yet.</p>"));d.append(voteBox("battle"+i,b[3]));$("#battles").append(d)});
debates.forEach((b,i)=>{const d=el("div","row","<h3>"+b[0]+"</h3><p>"+b[1]+"</p>");d.append(voteBox("debate"+i,b[2]));$("#debatelist").append(d)});

function newQuote(){$("#quote").textContent="“"+quotes[Math.floor(Math.random()*quotes.length)]+"”"}
$("#newq").onclick=newQuote;newQuote();

function drawGuests(){
  const list=store.get("midnightGuestbook",[]),box=$("#gl");box.textContent="";
  if(!list.length){box.append(el("p","muted","No one has signed yet. Be the first."));return}
  list.slice().reverse().forEach(m=>{const r=el("div","row");const n=el("strong");n.textContent=m.n||"A traveler";const p=el("p");p.textContent=m.t;r.append(n,p);box.append(r)})}
$("#gsave").onclick=()=>{
  const t=$("#gmsg").value.trim();
  if(!t){$("#gerr").textContent="The book cannot accept a blank page. Write a message first.";return}
  $("#gerr").textContent="";
  const list=store.get("midnightGuestbook",[]);list.push({n:$("#gname").value.trim(),t});
  store.set("midnightGuestbook",list);$("#gmsg").value="";drawGuests()};
drawGuests();

const views=[...document.querySelectorAll("main section")];
function route(){
  const id=(location.hash||"#home").slice(1),t=views.find(v=>v.id==="v-"+id)||$("#v-home"),cur=t.id.slice(2)==="origins"?"library":t.id.slice(2);
  views.forEach(v=>v.hidden=v!==t);
  document.querySelectorAll("nav a").forEach(a=>a.hash==="#"+cur?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
  window.scrollTo(0,0)}
addEventListener("hashchange",route);route();
