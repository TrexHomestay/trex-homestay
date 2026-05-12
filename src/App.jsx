import { useState, useEffect, useRef } from "react";

const WHATSAPP_NUMBER = "60137700776";
const WECHAT_ID = "TrexHomestay";
const WA_QR_URL = "https://i.postimg.cc/LsJwKH9B/Whats-App-QR.jpg";
const WX_QR_URL = "https://i.postimg.cc/N0KSqgs1/Wechat-QR.jpg";
const LOGO_URL = "https://i.postimg.cc/W1PBQDtT/logo.jpg";
const ADMIN_PW = "trex2025";

const PROJECTS = {
  RF_PRINCESS: { en: "R&F Princess Cove", zh: "富力公主湾", icon: "🌊" },
  RF_SEINE:    { en: "R&F Seine Region",  zh: "富力新天地",  icon: "🏙️" },
};

const AMENITY_ICONS = { "WiFi":"📶","Air Con":"❄️","Smart TV":"📺","Kitchen":"🍳","Full Kitchen":"🍳","Mini Kitchen":"🍳","Washer":"🫧","Balcony":"🌅","Pool Access":"🏊","Parking":"🅿️","Sea View":"🌊","City View":"🏙️","空调":"❄️","智能电视":"📺","厨房":"🍳","完整厨房":"🍳","迷你厨房":"🍳","洗衣机":"🫧","阳台":"🌅","泳池":"🏊","停车位":"🅿️","海景":"🌊","城景":"🏙️" };

const DEFAULT_PROPERTIES = [
  { id:1, project:"RF_PRINCESS", unit:"A-12-03", type:"Studio", name_en:"Cozy Studio · A-12-03", name_zh:"温馨开间 · A-12-03", desc_en:"Modern studio with stunning sea views at R&F Princess Cove. Fully furnished with premium amenities.", desc_zh:"富力公主湾现代开间，享有壮丽海景，配备顶级设施。", price:180, status:"available", maxGuests:2, cover:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Kitchen","Washer","Sea View"], amenities_zh:["WiFi","空调","智能电视","厨房","洗衣机","海景"], reviews:[{author:"Li Wei",rating:5,date:"2025-03-10",text_en:"Amazing view, super clean!",text_zh:"景色绝美，非常干净！"},{author:"Ahmad",rating:5,date:"2025-04-01",text_en:"Great location, will return!",text_zh:"位置极佳，会再来！"}] },
  { id:2, project:"RF_PRINCESS", unit:"B-08-11", type:"2 Bedrooms", name_en:"Seaview Suite · B-08-11", name_zh:"海景套房 · B-08-11", desc_en:"Spacious 2-bedroom with panoramic Strait of Johor views. Perfect for families.", desc_zh:"宽敞两卧室，全景柔佛海峡，适合家庭入住。", price:320, status:"available", maxGuests:5, cover:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", images:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80","https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80","https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Full Kitchen","Washer","Sea View","Balcony"], amenities_zh:["WiFi","空调","智能电视","完整厨房","洗衣机","海景","阳台"], reviews:[{author:"Siti Rahimah",rating:5,date:"2025-02-20",text_en:"Best homestay in JB!",text_zh:"新山最佳民宿！"}] },
  { id:3, project:"RF_PRINCESS", unit:"C-15-02", type:"3 Bedrooms", name_en:"Luxury Villa · C-15-02", name_zh:"豪华大房 · C-15-02", desc_en:"Premium 3-bedroom unit on high floor with full sea view. Ideal for large families.", desc_zh:"高楼层顶级三卧室，全海景，适合大家庭。", price:480, status:"available", maxGuests:8, cover:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Full Kitchen","Washer","Sea View","Balcony","Pool Access","Parking"], amenities_zh:["WiFi","空调","智能电视","完整厨房","洗衣机","海景","阳台","泳池","停车位"], reviews:[] },
  { id:4, project:"RF_SEINE", unit:"S-05-08", type:"Studio", name_en:"Urban Studio · S-05-08", name_zh:"都市开间 · S-05-08", desc_en:"Chic studio in R&F Seine Region, walking distance to malls and restaurants.", desc_zh:"富力新天地时尚开间，步行可达购物中心和餐厅。", price:160, status:"available", maxGuests:2, cover:"https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80", images:["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80","https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80","https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80","https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Mini Kitchen"], amenities_zh:["WiFi","空调","智能电视","迷你厨房"], reviews:[{author:"Chen Mei",rating:4,date:"2025-01-15",text_en:"Clean and convenient.",text_zh:"干净，位置方便。"}] },
  { id:5, project:"RF_SEINE", unit:"S-10-14", type:"2 Bedrooms", name_en:"City View 2BR · S-10-14", name_zh:"城景双房 · S-10-14", desc_en:"Elegant 2-bedroom in the heart of Johor Bahru. Great city views.", desc_zh:"新山市中心优雅两卧室，城市景观，交通便利。", price:300, status:"booked", maxGuests:4, cover:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", images:["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80","https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Full Kitchen","Washer","City View"], amenities_zh:["WiFi","空调","智能电视","完整厨房","洗衣机","城景"], reviews:[] },
  { id:6, project:"RF_SEINE", unit:"S-12-01", type:"3 Bedrooms", name_en:"Family Suite · S-12-01", name_zh:"家庭套间 · S-12-01", desc_en:"Spacious 3-bedroom family suite in R&F Seine Region with modern furnishings.", desc_zh:"富力新天地宽敞三卧室家庭套间，现代装修。", price:420, status:"available", maxGuests:8, cover:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", images:["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80","https://images.unsplash.com/photo-1600047508788-786f3865b759?w=800&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Full Kitchen","Washer","Balcony","Parking"], amenities_zh:["WiFi","空调","智能电视","完整厨房","洗衣机","阳台","停车位"], reviews:[] },
];

const T = {
  en:{ brand:"T-Rex Homestay", tagline:"Premium Homestays in Johor Bahru", subtitle:"R&F Princess Cove · R&F Seine Region", all_projects:"All Projects", filter_all:"All", filter_studio:"Studio", filter_2br:"2 Bedrooms", filter_3br:"3 Bedrooms", available:"Available", booked:"Booked", per_night:"/ night", max_guests:"Max", back:"← Back", book_now:"Book Now", view_details:"View Details", amenities:"Amenities", booking_title:"Request Booking", checkin:"Check-in", checkout:"Check-out", guestname:"Your Name", phone:"Phone", submit:"Send Booking Request", contact_title:"Complete Your Booking", contact_sub:"We'll confirm within 1 hour via WhatsApp or WeChat.", wa_btn:"Send via WhatsApp", wechat_title:"WeChat", scan_qr:"Scan to add us on WeChat", wechat_id_label:"WeChat ID", summary:"Booking Summary", nights:"nights", total:"Est. Total", fill_all:"Please fill in all fields.", date_err:"Please select valid dates.", footer:"© 2025 T-Rex Homestay. All rights reserved.", reviews:"Guest Reviews", no_reviews:"No reviews yet. Be the first!", leave_review:"Leave a Review", your_name:"Your Name", your_rating:"Rating", your_comment:"Your Review", submit_review:"Post Review", admin:"Admin", admin_title:"Admin Dashboard", add_property:"Add Property", edit:"Edit", delete:"Delete", save:"Save", cancel:"Cancel", upload_imgs:"Upload Images", prop_name_en:"Name (EN)", prop_name_zh:"Name (ZH)", prop_desc_en:"Description (EN)", prop_desc_zh:"Description (ZH)", prop_price:"Price (RM/night)", prop_unit:"Unit No.", prop_type:"Room Type", prop_project:"Project", prop_status:"Status", prop_maxguests:"Max Guests", prop_amenities:"Amenities (comma separated)", logout:"Logout", login:"Admin Login", password:"Password", login_btn:"Login", wrong_pw:"Incorrect password.", found:"found" },
  zh:{ brand:"T-Rex 民宿", tagline:"新山精品民宿", subtitle:"富力公主湾 · 富力新天地", all_projects:"全部项目", filter_all:"全部", filter_studio:"开间", filter_2br:"两卧室", filter_3br:"三卧室", available:"可预订", booked:"已订满", per_night:"/ 晚", max_guests:"最多", back:"← 返回", book_now:"立即预订", view_details:"查看详情", amenities:"设施", booking_title:"预订申请", checkin:"入住日期", checkout:"退房日期", guestname:"您的姓名", phone:"联系电话", submit:"发送预订申请", contact_title:"完成预订", contact_sub:"我们将在1小时内通过 WhatsApp 或微信确认。", wa_btn:"通过 WhatsApp 发送", wechat_title:"微信联系", scan_qr:"扫码添加微信", wechat_id_label:"微信号", summary:"预订摘要", nights:"晚", total:"预计总价", fill_all:"请填写所有字段。", date_err:"请选择有效日期。", footer:"© 2025 T-Rex 民宿. 版权所有。", reviews:"客人评价", no_reviews:"暂无评价，欢迎第一个留言！", leave_review:"撰写评价", your_name:"您的姓名", your_rating:"评分", your_comment:"您的评价", submit_review:"提交评价", admin:"管理", admin_title:"后台管理", add_property:"添加房源", edit:"编辑", delete:"删除", save:"保存", cancel:"取消", upload_imgs:"上传图片", prop_name_en:"名称（英文）", prop_name_zh:"名称（中文）", prop_desc_en:"描述（英文）", prop_desc_zh:"描述（中文）", prop_price:"价格（RM/晚）", prop_unit:"单位号", prop_type:"房型", prop_project:"楼盘", prop_status:"状态", prop_maxguests:"最多入住人数", prop_amenities:"设施（逗号分隔）", logout:"退出", login:"后台登录", password:"密码", login_btn:"登录", wrong_pw:"密码错误。", found:"个结果" },
};

const genId = () => Date.now() + Math.random();
const today = () => new Date().toISOString().split("T")[0];
const nightsBetween = (a,b) => a&&b ? Math.max(0,Math.round((new Date(b)-new Date(a))/86400000)) : 0;

const STORAGE_KEY = "trex_properties";
const getProps = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PROPERTIES));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)); }
};
const setProps = p => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
};

// ── Stars ──────────────────────────────────────────────────
const Stars = ({ n, size=16 }) => (
  <span style={{fontSize:size,lineHeight:1}}>
    {[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#f59e0b":"#ddd"}}>★</span>)}
  </span>
);

// ── Navbar ─────────────────────────────────────────────────
function Navbar({ lang, setLang, tx, onHome, onAdmin }) {
  return (
    <nav style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid #eee",position:"sticky",top:0,zIndex:200}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <button onClick={onHome} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO_URL} alt="T-Rex Logo" style={{height:40,width:40,objectFit:"contain",borderRadius:6}} />
          <span style={{fontSize:17,fontWeight:800,color:"#111",letterSpacing:-0.5}}>{tx.brand}</span>
        </button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {["en","zh"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",borderColor:lang===l?"#111":"#ddd",background:lang===l?"#111":"#fff",color:lang===l?"#fff":"#666"}}>
              {l==="en"?"EN":"中文"}
            </button>
          ))}
          <button onClick={onAdmin} style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid #e0e0e0",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fff",color:"#888"}}>
            ⚙️ {tx.admin}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────
function Hero({ tx, lang }) {
  return (
    <div style={{background:"linear-gradient(135deg,#0a1628 0%,#0f2d5a 50%,#1a4a8a 100%)",color:"#fff",textAlign:"center",padding:"56px 20px 48px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"relative"}}>
        <img src={LOGO_URL} alt="T-Rex" style={{height:72,width:72,objectFit:"contain",marginBottom:12,borderRadius:8}} />
        <h1 style={{fontSize:30,fontWeight:900,margin:"0 0 10px",letterSpacing:-1}}>{tx.tagline}</h1>
        <p style={{fontSize:15,color:"#7eb3e8",margin:"0 0 20px"}}>{tx.subtitle}</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          {Object.entries(PROJECTS).map(([k,v])=>(
            <div key={k} style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 20px",border:"1px solid rgba(255,255,255,0.15)"}}>
              <span style={{fontSize:20}}>{v.icon}</span>
              <span style={{marginLeft:8,fontWeight:700,fontSize:14}}>{lang==="zh"?v.zh:v.en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FilterBar ──────────────────────────────────────────────
function FilterBar({ project, setProject, filter, setFilter, tx, lang, count }) {
  const projects = [{key:"ALL",en:tx.all_projects,zh:tx.all_projects},...Object.entries(PROJECTS).map(([k,v])=>({key:k,en:v.en,zh:v.zh}))];
  const types = [["All",tx.filter_all],["Studio",tx.filter_studio],["2 Bedrooms",tx.filter_2br],["3 Bedrooms",tx.filter_3br]];
  const btn = (active,onClick,label,small) => (
    <button onClick={onClick} style={{padding:small?"6px 14px":"7px 18px",borderRadius:24,border:"1.5px solid",fontSize:small?12:13,fontWeight:600,cursor:"pointer",transition:"all .15s",borderColor:active?"#0f2d5a":"#e0e0e0",background:active?"#0f2d5a":"#fff",color:active?"#fff":"#555"}}>
      {label}
    </button>
  );
  return (
    <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"16px 20px",position:"sticky",top:58,zIndex:100}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
          {projects.map(p=>btn(project===p.key,()=>setProject(p.key),lang==="zh"?p.zh:p.en,false))}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {types.map(([k,l])=>btn(filter===k,()=>setFilter(k),l,true))}
          <span style={{marginLeft:"auto",fontSize:12,color:"#999"}}>{count} {tx.found}</span>
        </div>
      </div>
    </div>
  );
}

// ── PropertyCard ───────────────────────────────────────────
function PropertyCard({ p, lang, tx, onClick }) {
  const name = lang==="zh"?p.name_zh:p.name_en;
  const avail = p.status==="available";
  const avgRating = p.reviews?.length?(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length).toFixed(1):null;
  const proj = PROJECTS[p.project];
  return (
    <div onClick={()=>avail&&onClick(p)} style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",cursor:avail?"pointer":"default",transition:"transform .2s, box-shadow .2s",opacity:avail?1:0.7}}
      onMouseEnter={e=>{if(avail){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.13)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}>
      <div style={{position:"relative",height:200,overflow:"hidden",background:"#f0f0f0"}}>
        <img src={p.cover} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
        <div style={{position:"absolute",top:10,left:10,background:avail?"#16a34a":"#dc2626",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>
          {avail?tx.available:tx.booked}
        </div>
        {proj&&<div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>
          {proj.icon} {lang==="zh"?proj.zh:proj.en}
        </div>}
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:8,marginBottom:2}}>
          <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#111",lineHeight:1.3}}>{name}</h3>
          <span style={{background:"#f3f4f6",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:600,color:"#555",whiteSpace:"nowrap"}}>{p.type}</span>
        </div>
        <p style={{margin:"4px 0 8px",fontSize:12,color:"#999"}}>🔑 {p.unit}</p>
        {avgRating&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}><Stars n={Math.round(avgRating)} size={13}/><span style={{fontSize:12,color:"#666"}}>{avgRating} ({p.reviews.length})</span></div>}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><span style={{fontSize:20,fontWeight:800,color:"#0f2d5a"}}>RM {p.price}</span><span style={{fontSize:12,color:"#aaa"}}> {tx.per_night}</span></div>
          <span style={{fontSize:11,color:"#aaa"}}>👥 {tx.max_guests} {p.maxGuests}</span>
        </div>
        {avail&&<button style={{marginTop:12,width:"100%",padding:"9px 0",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{tx.view_details}</button>}
      </div>
    </div>
  );
}

// ── Carousel ───────────────────────────────────────────────
function Carousel({ images }) {
  const [idx,setIdx] = useState(0);
  useEffect(()=>setIdx(0),[images]);
  const imgs = images||[];
  return (
    <div style={{position:"relative",borderRadius:16,overflow:"hidden",background:"#000",marginBottom:24,userSelect:"none"}}>
      <img src={imgs[idx]} alt="" style={{width:"100%",height:360,objectFit:"cover",display:"block"}} />
      {imgs.length>1&&<>
        <button onClick={()=>setIdx((idx-1+imgs.length)%imgs.length)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.88)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:"pointer",fontWeight:700}}>‹</button>
        <button onClick={()=>setIdx((idx+1)%imgs.length)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.88)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:"pointer",fontWeight:700}}>›</button>
        <div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>
          {imgs.map((_,i)=><button key={i} onClick={()=>setIdx(i)} style={{width:i===idx?22:7,height:7,borderRadius:4,border:"none",background:i===idx?"#fff":"rgba(255,255,255,0.45)",cursor:"pointer",padding:0,transition:"all .2s"}} />)}
        </div>
        <div style={{position:"absolute",bottom:10,right:14,background:"rgba(0,0,0,0.45)",color:"#fff",borderRadius:20,padding:"2px 9px",fontSize:11}}>{idx+1}/{imgs.length}</div>
      </>}
    </div>
  );
}

// ── ReviewSection ──────────────────────────────────────────
function ReviewSection({ p, lang, tx, onAddReview }) {
  const [show,setShow] = useState(false);
  const [name,setName] = useState("");
  const [rating,setRating] = useState(5);
  const [comment,setComment] = useState("");
  const [hover,setHover] = useState(0);
  const submit = () => {
    if(!name.trim()||!comment.trim()) return;
    onAddReview(p.id,{author:name,rating,date:today(),text_en:comment,text_zh:comment});
    setName(""); setComment(""); setRating(5); setShow(false);
  };
  return (
    <div style={{marginTop:32}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h3 style={{margin:0,fontSize:17,fontWeight:700,color:"#111"}}>💬 {tx.reviews} ({p.reviews?.length||0})</h3>
        <button onClick={()=>setShow(!show)} style={{padding:"7px 16px",borderRadius:20,border:"1.5px solid #0f2d5a",background:show?"#0f2d5a":"#fff",color:show?"#fff":"#0f2d5a",fontWeight:600,fontSize:13,cursor:"pointer"}}>
          ✏️ {tx.leave_review}
        </button>
      </div>
      {show&&(
        <div style={{background:"#f8faff",borderRadius:14,padding:20,marginBottom:20,border:"1px solid #e0e8f8"}}>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:13,fontWeight:600,color:"#333",display:"block",marginBottom:5}}>{tx.your_name}</label>
            <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,boxSizing:"border-box"}} />
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:13,fontWeight:600,color:"#333",display:"block",marginBottom:5}}>{tx.your_rating}</label>
            <div style={{display:"flex",gap:4}}>
              {[1,2,3,4,5].map(i=>(
                <span key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(i)}
                  style={{fontSize:28,cursor:"pointer",color:i<=(hover||rating)?"#f59e0b":"#ddd",transition:"color .1s"}}>★</span>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:13,fontWeight:600,color:"#333",display:"block",marginBottom:5}}>{tx.your_comment}</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}} />
          </div>
          <button onClick={submit} style={{padding:"9px 24px",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.submit_review}</button>
        </div>
      )}
      {!p.reviews?.length?<p style={{color:"#aaa",fontSize:14}}>{tx.no_reviews}</p>:(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[...p.reviews].reverse().map((r,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:12,padding:"14px 16px",border:"1px solid #eee",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#0f2d5a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15}}>{r.author[0].toUpperCase()}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{r.author}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><Stars n={r.rating} size={13}/><span style={{fontSize:11,color:"#aaa"}}>{r.date}</span></div>
                </div>
              </div>
              <p style={{margin:0,fontSize:14,color:"#444",lineHeight:1.6}}>{lang==="zh"?r.text_zh:r.text_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DetailPage ─────────────────────────────────────────────
function DetailPage({ p, lang, tx, onBook, onBack, onAddReview }) {
  const name = lang==="zh"?p.name_zh:p.name_en;
  const desc = lang==="zh"?p.desc_zh:p.desc_en;
  const amenities = lang==="zh"?p.amenities_zh:p.amenities_en;
  const proj = PROJECTS[p.project];
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"24px 20px 48px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#555",fontWeight:600,marginBottom:18,padding:0}}>{tx.back}</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        {proj&&<span style={{background:"#e8f0fe",color:"#0f2d5a",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700}}>{proj.icon} {lang==="zh"?proj.zh:proj.en}</span>}
        <span style={{background:"#f3f4f6",color:"#555",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:600}}>{p.type}</span>
        <span style={{background:p.status==="available"?"#dcfce7":"#fee2e2",color:p.status==="available"?"#16a34a":"#dc2626",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700}}>{p.status==="available"?tx.available:tx.booked}</span>
      </div>
      <h2 style={{margin:"4px 0 4px",fontSize:24,fontWeight:800,color:"#111"}}>{name}</h2>
      <p style={{margin:"0 0 20px",color:"#888",fontSize:13}}>🔑 {p.unit} · 👥 {tx.max_guests} {p.maxGuests}</p>
      <Carousel images={p.images} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:28}}>
        <div>
          <p style={{fontSize:15,lineHeight:1.8,color:"#444",margin:"0 0 20px"}}>{desc}</p>
          <h4 style={{margin:"0 0 10px",fontSize:15,fontWeight:700}}>{tx.amenities}</h4>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {(amenities||[]).map(a=><span key={a} style={{background:"#f3f4f6",borderRadius:20,padding:"5px 13px",fontSize:13,color:"#444"}}>{AMENITY_ICONS[a]||"✓"} {a}</span>)}
          </div>
          <ReviewSection p={p} lang={lang} tx={tx} onAddReview={onAddReview} />
        </div>
        <div style={{alignSelf:"start",position:"sticky",top:120}}>
          <div style={{background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:16,padding:22,boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
            <div style={{marginBottom:16}}>
              <span style={{fontSize:26,fontWeight:800,color:"#0f2d5a"}}>RM {p.price}</span>
              <span style={{fontSize:14,color:"#aaa"}}> {tx.per_night}</span>
            </div>
            {p.reviews?.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
              <Stars n={Math.round(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length)} size={15}/>
              <span style={{fontSize:13,color:"#666"}}>{(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length).toFixed(1)} ({p.reviews.length})</span>
            </div>}
            <button onClick={()=>onBook(p)} disabled={p.status!=="available"}
              style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:p.status==="available"?"linear-gradient(135deg,#0f2d5a,#1a5aad)":"#ddd",color:"#fff",fontWeight:700,fontSize:15,cursor:p.status==="available"?"pointer":"not-allowed"}}>
              {tx.book_now}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BookingPage ────────────────────────────────────────────
function BookingPage({ p, lang, tx, onBack }) {
  const [checkin,setCheckin] = useState("");
  const [checkout,setCheckout] = useState("");
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [step,setStep] = useState(1);
  const [err,setErr] = useState("");
  const pname = lang==="zh"?p.name_zh:p.name_en;
  const nights = nightsBetween(checkin,checkout);
  const submit = () => {
    if(!name.trim()||!phone.trim()){setErr(tx.fill_all);return;}
    if(!checkin||!checkout||nights<=0){setErr(tx.date_err);return;}
    setErr(""); setStep(2);
  };
  const waMsg = encodeURIComponent(`Hi T-Rex Homestay! I'd like to book:\n🏠 Unit: ${pname} (${p.unit})\n📅 Check-in: ${checkin}\n📅 Check-out: ${checkout} (${nights} nights)\n👤 Name: ${name}\n📞 Phone: ${phone}\n💰 Est. Total: RM ${nights*p.price}\n\nPlease confirm availability. Thank you!`);
  const inp = {width:"100%",padding:"11px 13px",borderRadius:10,border:"1.5px solid #e0e0e0",fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"};
  return (
    <div style={{maxWidth:580,margin:"0 auto",padding:"24px 20px 48px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#555",fontWeight:600,marginBottom:20,padding:0}}>{tx.back}</button>
      {step===1?(
        <>
          <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800}}>{tx.booking_title}</h2>
          <p style={{margin:"0 0 22px",color:"#888",fontSize:13}}>🏠 {pname} · 🔑 {p.unit}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.checkin}</label><input type="date" value={checkin} onChange={e=>setCheckin(e.target.value)} style={inp} min={today()} /></div>
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.checkout}</label><input type="date" value={checkout} onChange={e=>setCheckout(e.target.value)} style={inp} min={checkin||today()} /></div>
          </div>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.guestname}</label><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Zhang Wei" style={inp} /></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.phone}</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+60 1X-XXXXXXX" style={inp} /></div>
          {nights>0&&<div style={{background:"#eff6ff",borderRadius:12,padding:"12px 16px",marginBottom:14,border:"1px solid #bfdbfe"}}>
            <p style={{margin:"0 0 3px",fontWeight:700,fontSize:13,color:"#1e40af"}}>{tx.summary}</p>
            <p style={{margin:0,fontSize:13,color:"#444"}}>{nights} {tx.nights} × RM {p.price} = <strong>RM {nights*p.price}</strong></p>
          </div>}
          {err&&<p style={{color:"#ef4444",fontSize:13,marginBottom:10}}>{err}</p>}
          <button onClick={submit} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:"linear-gradient(135deg,#0f2d5a,#1a5aad)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{tx.submit}</button>
        </>
      ):(
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:10}}>🎉</div>
          <h2 style={{margin:"0 0 6px",fontSize:22,fontWeight:800}}>{tx.contact_title}</h2>
          <p style={{margin:"0 0 24px",color:"#666",fontSize:14}}>{tx.contact_sub}</p>
          <div style={{background:"#f0fdf4",borderRadius:14,padding:"14px 18px",marginBottom:18,border:"1px solid #bbf7d0",textAlign:"left"}}>
            <p style={{margin:"0 0 6px",fontWeight:700,fontSize:13,color:"#15803d"}}>{tx.summary}</p>
            {[`🏠 ${pname} (${p.unit})`,`📅 ${checkin} → ${checkout} (${nights} ${tx.nights})`,`👤 ${name} · ${phone}`,`💰 ${tx.total}: RM ${nights*p.price}`].map((l,i)=><p key={i} style={{margin:"2px 0",fontSize:13,color:"#444"}}>{l}</p>)}
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:12,background:"#25d366",color:"#fff",fontWeight:700,fontSize:16,textDecoration:"none",marginBottom:18}}>
            <span style={{fontSize:20}}>💬</span> {tx.wa_btn}
          </a>
          <div style={{background:"#fff",border:"1px solid #eee",borderRadius:16,padding:20,marginBottom:14}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14,color:"#111"}}>📱 WhatsApp QR</p>
            <p style={{margin:"0 0 12px",fontSize:12,color:"#888"}}>trexhomeandhouse</p>
            <img src={WA_QR_URL} alt="WhatsApp QR" style={{width:160,height:160,borderRadius:10,border:"1px solid #eee",objectFit:"cover",display:"block",margin:"0 auto"}} />
            <p style={{margin:"10px 0 0",fontSize:13,color:"#555"}}>+{WHATSAPP_NUMBER}</p>
          </div>
          <div style={{background:"#fff",border:"1px solid #eee",borderRadius:16,padding:20}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14,color:"#111"}}>🟢 {tx.wechat_title}</p>
            <p style={{margin:"0 0 12px",fontSize:12,color:"#888"}}>{tx.scan_qr}</p>
            <img src={WX_QR_URL} alt="WeChat QR" style={{width:160,height:160,borderRadius:10,border:"1px solid #eee",objectFit:"cover",display:"block",margin:"0 auto"}} />
            <p style={{margin:"10px 0 0",fontSize:13,color:"#555"}}>{tx.wechat_id_label}: <strong>{WECHAT_ID}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AdminLogin ─────────────────────────────────────────────
function AdminLogin({ tx, onLogin }) {
  const [pw,setPw] = useState("");
  const [err,setErr] = useState("");
  const attempt = () => pw===ADMIN_PW?onLogin():setErr(tx.wrong_pw);
  return (
    <div style={{maxWidth:360,margin:"80px auto",padding:32,background:"#fff",borderRadius:20,boxShadow:"0 4px 32px rgba(0,0,0,0.1)",textAlign:"center"}}>
      <img src={LOGO_URL} alt="T-Rex" style={{height:60,width:60,objectFit:"contain",marginBottom:12,borderRadius:8}} />
      <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800}}>{tx.login}</h2>
      <p style={{margin:"0 0 24px",color:"#888",fontSize:13}}>T-Rex Admin</p>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()}
        placeholder={tx.password} style={{width:"100%",padding:"12px",borderRadius:10,border:"1.5px solid #e0e0e0",fontSize:14,boxSizing:"border-box",marginBottom:10}} />
      {err&&<p style={{color:"#ef4444",fontSize:13,marginBottom:8}}>{err}</p>}
      <button onClick={attempt} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{tx.login_btn}</button>
    </div>
  );
}

// ── AdminPanel ─────────────────────────────────────────────
function AdminPanel({ tx, lang, properties, onUpdate, onLogout }) {
  const [editId,setEditId] = useState(null);
  const [adding,setAdding] = useState(false);
  const fileRef = useRef();
  const blank = {id:genId(),project:"RF_PRINCESS",unit:"",type:"Studio",name_en:"",name_zh:"",desc_en:"",desc_zh:"",price:200,status:"available",maxGuests:2,cover:"",images:[],amenities_en:[],amenities_zh:[],reviews:[]};
  const [form,setForm] = useState({...blank,amenities_en_str:"",amenities_zh_str:""});

  const startEdit = p => {
    setForm({...p, images:p.images||[], amenities_en:p.amenities_en||[], amenities_zh:p.amenities_zh||[], amenities_en_str:(p.amenities_en||[]).join(", "), amenities_zh_str:(p.amenities_zh||[]).join(", ")});
    setEditId(p.id); setAdding(false);
  };
  const startAdd = () => { setForm({...blank,id:genId(),amenities_en_str:"",amenities_zh_str:""}); setAdding(true); setEditId(null); };
  const cancel = () => { setEditId(null); setAdding(false); };
  const save = () => {
    const updated = {...form, amenities_en:(form.amenities_en_str||"").split(",").map(s=>s.trim()).filter(Boolean), amenities_zh:(form.amenities_zh_str||"").split(",").map(s=>s.trim()).filter(Boolean), price:Number(form.price), maxGuests:Number(form.maxGuests)};
    if(!updated.cover&&updated.images.length) updated.cover=updated.images[0];
    if(adding) onUpdate([...properties,updated]);
    else onUpdate(properties.map(p=>p.id===editId?updated:p));
    cancel();
  };
  const del = id => { if(window.confirm("Delete this property?")) onUpdate(properties.filter(p=>p.id!==id)); };
  const handleImgUpload = e => {
    Array.from(e.target.files).forEach(f=>{
      const r = new FileReader();
      r.onload = ev => setForm(prev=>({...prev,images:[...(prev.images||[]),ev.target.result],cover:prev.cover||ev.target.result}));
      r.readAsDataURL(f);
    });
  };
  const removeImg = i => setForm(prev=>{ const imgs=(prev.images||[]).filter((_,j)=>j!==i); return {...prev,images:imgs,cover:imgs[0]||""}; });

  const inp = {width:"100%",padding:"9px 11px",borderRadius:8,border:"1.5px solid #e0e0e0",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"};
  const lbl = {display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:4};
  const grouped = Object.keys(PROJECTS).reduce((acc,k)=>{acc[k]=properties.filter(p=>p.project===k);return acc;},{});

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px 48px"}}>
      {/* Modal */}
      {(editId||adding)&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:640,margin:"auto"}}>
            <h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800}}>{adding?tx.add_property:tx.edit}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={lbl}>{tx.prop_project}</label>
                <select value={form.project} onChange={e=>setForm(f=>({...f,project:e.target.value}))} style={inp}>
                  {Object.entries(PROJECTS).map(([k,v])=><option key={k} value={k}>{lang==="zh"?v.zh:v.en}</option>)}
                </select>
              </div>
              <div><label style={lbl}>{tx.prop_unit}</label><input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} style={inp} placeholder="e.g. A-12-03" /></div>
              <div><label style={lbl}>{tx.prop_type}</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inp}>
                  {["Studio","2 Bedrooms","3 Bedrooms"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={lbl}>{tx.prop_status}</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={inp}>
                  <option value="available">{tx.available}</option>
                  <option value="booked">{tx.booked}</option>
                </select>
              </div>
              <div><label style={lbl}>{tx.prop_price}</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>{tx.prop_maxguests}</label><input type="number" value={form.maxGuests} onChange={e=>setForm(f=>({...f,maxGuests:e.target.value}))} style={inp} /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_name_en}</label><input value={form.name_en} onChange={e=>setForm(f=>({...f,name_en:e.target.value}))} style={inp} /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_name_zh}</label><input value={form.name_zh} onChange={e=>setForm(f=>({...f,name_zh:e.target.value}))} style={inp} /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_desc_en}</label><textarea value={form.desc_en} onChange={e=>setForm(f=>({...f,desc_en:e.target.value}))} rows={2} style={inp} /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_desc_zh}</label><textarea value={form.desc_zh} onChange={e=>setForm(f=>({...f,desc_zh:e.target.value}))} rows={2} style={inp} /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_amenities} (EN)</label><input value={form.amenities_en_str} onChange={e=>setForm(f=>({...f,amenities_en_str:e.target.value}))} style={inp} placeholder="WiFi, Air Con, Sea View" /></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_amenities} (ZH)</label><input value={form.amenities_zh_str} onChange={e=>setForm(f=>({...f,amenities_zh_str:e.target.value}))} style={inp} placeholder="WiFi, 空调, 海景" /></div>
            </div>
            <div style={{marginTop:16}}>
              <label style={lbl}>🖼️ {tx.upload_imgs}</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImgUpload} style={{display:"none"}} />
              <button onClick={()=>fileRef.current.click()} style={{padding:"8px 18px",borderRadius:8,border:"1.5px dashed #0f2d5a",background:"#f0f4ff",color:"#0f2d5a",fontWeight:600,fontSize:13,cursor:"pointer"}}>+ Upload Images</button>
              {form.images?.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                  {form.images.map((img,i)=>(
                    <div key={i} style={{position:"relative"}}>
                      <img src={img} alt="" style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:i===0?"2.5px solid #0f2d5a":"1px solid #ddd"}} />
                      {i===0&&<span style={{position:"absolute",bottom:2,left:2,background:"#0f2d5a",color:"#fff",fontSize:9,borderRadius:4,padding:"1px 4px"}}>Cover</span>}
                      <button onClick={()=>removeImg(i)} style={{position:"absolute",top:-6,right:-6,background:"#ef4444",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer",lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{marginTop:10}}>
                <label style={{display:"block",fontSize:12,fontWeight:500,color:"#555",marginBottom:4}}>Or cover URL:</label>
                <input value={form.cover} onChange={e=>setForm(f=>({...f,cover:e.target.value}))} style={inp} placeholder="https://..." />
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={save} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.save}</button>
              <button onClick={cancel} style={{flex:1,padding:"11px 0",borderRadius:10,border:"1.5px solid #ddd",background:"#fff",color:"#555",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.cancel}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:800}}>⚙️ {tx.admin_title}</h2>
        <div style={{display:"flex",gap:10}}>
          <button onClick={startAdd} style={{padding:"9px 20px",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ {tx.add_property}</button>
          <button onClick={onLogout} style={{padding:"9px 16px",borderRadius:10,border:"1.5px solid #ddd",background:"#fff",color:"#666",fontWeight:600,fontSize:13,cursor:"pointer"}}>{tx.logout}</button>
        </div>
      </div>
      {Object.entries(grouped).map(([proj,props])=>(
        <div key={proj} style={{marginBottom:32}}>
          <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#0f2d5a",display:"flex",alignItems:"center",gap:8}}>
            {PROJECTS[proj].icon} {lang==="zh"?PROJECTS[proj].zh:PROJECTS[proj].en}
            <span style={{background:"#e8f0fe",color:"#0f2d5a",borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:600}}>{props.length} 套</span>
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",gap:14}}>
            {props.map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:14,border:"1px solid #eee",overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
                <div style={{position:"relative",height:130}}>
                  {p.cover?<img src={p.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<div style={{width:"100%",height:"100%",background:"#f0f4f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🏠</div>}
                  <div style={{position:"absolute",top:8,right:8,background:p.status==="available"?"#16a34a":"#dc2626",color:"#fff",borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700}}>{p.status==="available"?tx.available:tx.booked}</div>
                </div>
                <div style={{padding:"12px 14px"}}>
                  <p style={{margin:"0 0 2px",fontWeight:700,fontSize:13,color:"#111"}}>{lang==="zh"?p.name_zh:p.name_en}</p>
                  <p style={{margin:"0 0 10px",fontSize:11,color:"#aaa"}}>🔑 {p.unit} · {p.type} · RM {p.price}/night</p>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>startEdit(p)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"1.5px solid #0f2d5a",background:"#fff",color:"#0f2d5a",fontWeight:600,fontSize:12,cursor:"pointer"}}>✏️ {tx.edit}</button>
                    <button onClick={()=>del(p.id)} style={{flex:1,padding:"7px 0",borderRadius:8,border:"1.5px solid #ef4444",background:"#fff",color:"#ef4444",fontWeight:600,fontSize:12,cursor:"pointer"}}>🗑️ {tx.delete}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function App() {
  const [lang,setLang] = useState("zh");
  const [project,setProject] = useState("ALL");
  const [filter,setFilter] = useState("All");
  const [page,setPage] = useState("home");
  const [selected,setSelected] = useState(null);
  const [properties,setProperties] = useState(getProps());
  const [isAdmin,setIsAdmin] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const tx = T[lang];

  const updateProperties = p => { setProps(p); setProperties([...p]); };
  const addReview = (propId,review) => {
    const updated = properties.map(p=>p.id===propId?{...p,reviews:[...(p.reviews||[]),review]}:p);
    updateProperties(updated);
    if(selected?.id===propId) setSelected(updated.find(p=>p.id===propId));
  };
  const filtered = properties.filter(p=>(project==="ALL"||p.project===project)&&(filter==="All"||p.type===filter));
  const nav = (pg,prop=null) => { setPage(pg); if(prop) setSelected(prop); window.scrollTo(0,0); };

  if(showLogin&&!isAdmin) return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Navbar lang={lang} setLang={setLang} tx={tx} onHome={()=>{setShowLogin(false);setPage("home");}} onAdmin={()=>{}} />
      <AdminLogin tx={tx} onLogin={()=>{setIsAdmin(true);setShowLogin(false);setPage("admin");}} />
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Navbar lang={lang} setLang={setLang} tx={tx} onHome={()=>nav("home")} onAdmin={()=>{if(isAdmin)nav("admin");else setShowLogin(true);}} />
      {page==="home"&&<>
        <Hero tx={tx} lang={lang} />
        <FilterBar project={project} setProject={setProject} filter={filter} setFilter={setFilter} tx={tx} lang={lang} count={filtered.length} />
        <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px 48px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:22}}>
            {filtered.map(p=><PropertyCard key={p.id} p={p} lang={lang} tx={tx} onClick={prop=>nav("detail",prop)} />)}
          </div>
          {filtered.length===0&&<p style={{textAlign:"center",color:"#aaa",padding:"60px 0"}}>No properties found.</p>}
        </div>
      </>}
      {page==="detail"&&selected&&<DetailPage p={properties.find(p=>p.id===selected.id)||selected} lang={lang} tx={tx} onBook={p=>nav("booking",p)} onBack={()=>nav("home")} onAddReview={addReview} />}
      {page==="booking"&&selected&&<BookingPage p={selected} lang={lang} tx={tx} onBack={()=>nav("detail",selected)} />}
      {page==="admin"&&isAdmin&&<AdminPanel tx={tx} lang={lang} properties={properties} onUpdate={updateProperties} onLogout={()=>{setIsAdmin(false);setPage("home");}} />}
      <footer style={{background:"#0a1628",color:"#556",textAlign:"center",padding:"22px 20px",fontSize:12}}>
        <img src={LOGO_URL} alt="" style={{height:20,width:20,objectFit:"contain",verticalAlign:"middle",marginRight:6,borderRadius:3}} />
        <span style={{color:"#7eb3e8",fontWeight:700}}>{tx.brand}</span> &nbsp;·&nbsp; {tx.footer}
      </footer>
    </div>
  );
}
