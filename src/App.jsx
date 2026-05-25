import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyA-ZKs5svNygZga3rNoLJ7k6q9JpdXjH3I",
  authDomain: "trex-homestay.firebaseapp.com",
  projectId: "trex-homestay",
  storageBucket: "trex-homestay.firebasestorage.app",
  messagingSenderId: "162512186134",
  appId: "1:162512186134:web:ca52ac4a2f8db49da43e37"
});
const db = getFirestore(firebaseApp);
const saveToCloud = async (properties) => {
  try {
    await setDoc(doc(db,"data","properties"), { list: properties, updatedAt: Date.now() });
    console.log("✅ Saved", properties.length, "properties to Firebase");
    return true;
  } catch(e) {
    console.error("❌ Save error:",e);
    alert("保存失败：" + e.message);
    return false;
  }
};

// 迁移旧数据：price → priceWeekday + priceWeekend
const migrateProperty = (p) => {
  if (p.priceWeekday === undefined) {
    const base = p.price || 200;
    return { ...p, priceWeekday: base, priceWeekend: Math.round(base * 1.2) };
  }
  return p;
};

const loadFromCloud = async () => {
  try {
    const s = await getDoc(doc(db,"data","properties"));
    if (s.exists()) {
      const list = s.data().list;
      console.log("✅ Loaded", list.length, "properties from Firebase");
      return list.map(migrateProperty);
    }
    console.log("⚠️ No data in Firebase, using defaults");
    return null;
  } catch(e) {
    console.error("❌ Load error:",e);
    return null;
  }
};

// ── Cloudinary ─────────────────────────────────────────────
const CLOUDINARY_PRESET = "trex_upload";
const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:"POST", body:fd });
  const d = await res.json();
  return d.secure_url;
};

const CLOUDINARY_CLOUD = "dij7dlx83";
const CLOUDINARY_PRESET = "trex_upload";
const WHATSAPP_NUMBER = "60137700776";
const WECHAT_ID = "TrexHomestay";
const WA_QR = "https://i.postimg.cc/LsJwKH9B/Whats-App-QR.jpg";
const WX_QR = "https://i.postimg.cc/N0KSqgs1/Wechat-QR.jpg";
const LOGO = "https://i.postimg.cc/W1PBQDtT/logo.jpg";
const ADMIN_PW = "trex2025";

const PROJECTS = {
  RF_PRINCESS: { en:"R&F Princess Cove", zh:"富力公主湾", icon:"🌊" },
  RF_SEINE:    { en:"R&F Seine Region",  zh:"富力新天地",  icon:"🏙️" },
};

const AMI = { "WiFi":"📶","Air Con":"❄️","Smart TV":"📺","Kitchen":"🍳","Full Kitchen":"🍳","Mini Kitchen":"🍳","Washer":"🫧","Balcony":"🌅","Pool Access":"🏊","Parking":"🅿️","Sea View":"🌊","City View":"🏙️","空调":"❄️","智能电视":"📺","厨房":"🍳","完整厨房":"🍳","迷你厨房":"🍳","洗衣机":"🫧","阳台":"🌅","泳池":"🏊","停车位":"🅿️","海景":"🌊","城景":"🏙️" };

const ROOM_TYPES = ["Studio","1 Bedroom","2 Bedrooms","3 Bedrooms","Dual Key"];

const DEFAULT_PROPS = [
  { id:1, project:"RF_PRINCESS", unit:"A-12-03", type:"Studio", name_en:"Cozy Studio · A-12-03", name_zh:"温馨开间 · A-12-03", desc_en:"Modern studio with stunning sea views at R&F Princess Cove.", desc_zh:"富力公主湾现代开间，享有壮丽海景。", priceWeekday:180, priceWeekend:220, status:"available", maxGuests:2, cover:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Kitchen","Sea View"], amenities_zh:["WiFi","空调","智能电视","厨房","海景"], reviews:[] },
  { id:2, project:"RF_PRINCESS", unit:"B-08-11", type:"2 Bedrooms", name_en:"Seaview Suite · B-08-11", name_zh:"海景套房 · B-08-11", desc_en:"Spacious 2-bedroom with panoramic sea views.", desc_zh:"宽敞两卧室，全景柔佛海峡。", priceWeekday:320, priceWeekend:380, status:"available", maxGuests:5, cover:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", images:["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"], amenities_en:["WiFi","Air Con","Full Kitchen","Sea View","Balcony"], amenities_zh:["WiFi","空调","完整厨房","海景","阳台"], reviews:[] },
  { id:3, project:"RF_SEINE", unit:"S-05-08", type:"Studio", name_en:"Urban Studio · S-05-08", name_zh:"都市开间 · S-05-08", desc_en:"Chic studio in R&F Seine Region.", desc_zh:"富力新天地时尚开间。", priceWeekday:160, priceWeekend:200, status:"available", maxGuests:2, cover:"https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80", images:["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80"], amenities_en:["WiFi","Air Con","Smart TV","Mini Kitchen"], amenities_zh:["WiFi","空调","智能电视","迷你厨房"], reviews:[] },
];

const T = {
  en:{ brand:"T-Rex Homestay", tagline:"R&F Homestay @ T-Rex", subtitle:"R&F Princess Cove · R&F Seine Region", all_projects:"All Projects", filter_all:"All", filter_studio:"Studio", filter_1br:"1 Bedroom", filter_2br:"2 Bedrooms", filter_3br:"3 Bedrooms", filter_dk:"Dual Key", available:"Available", booked:"Booked", per_night:"/ night", weekday:"Weekday", weekend:"Weekend", max_guests:"Max", back:"← Back", book_now:"Book Now", view_details:"View Details", amenities:"Amenities", booking_title:"Request Booking", checkin:"Check-in", checkout:"Check-out", guestname:"Your Name", phone:"Phone", submit:"Send Booking Request", contact_title:"Complete Your Booking", contact_sub:"We'll confirm within 1 hour via WhatsApp or WeChat.", wa_btn:"Send via WhatsApp", wechat_title:"WeChat", scan_qr:"Scan to add us on WeChat", wechat_id_label:"WeChat ID", summary:"Booking Summary", nights:"nights", weekday_nights:"weekday night(s)", weekend_nights:"weekend night(s)", total:"Est. Total", fill_all:"Please fill in all fields.", date_err:"Please select valid dates.", footer:"© 2025 T-Rex Homestay. All rights reserved.", reviews:"Guest Reviews", no_reviews:"No reviews yet. Be the first!", leave_review:"Leave a Review", your_name:"Your Name", your_rating:"Rating", your_comment:"Your Review", submit_review:"Post Review", admin:"Admin", admin_title:"Admin Dashboard", add_property:"Add Property", edit:"Edit", delete:"Delete", save:"Save", cancel:"Cancel", upload_imgs:"Upload Images", prop_name_en:"Name (EN)", prop_name_zh:"Name (ZH)", prop_desc_en:"Description (EN)", prop_desc_zh:"Description (ZH)", prop_price_wd:"Weekday Price (RM)", prop_price_we:"Weekend Price (RM)", prop_unit:"Unit No.", prop_type:"Room Type", prop_project:"Project", prop_status:"Status", prop_maxguests:"Max Guests", prop_amenities:"Amenities (comma separated)", logout:"Logout", login:"Admin Login", password:"Password", login_btn:"Login", wrong_pw:"Incorrect password.", found:"found", loading:"Loading...", saving:"Saving..." },
  zh:{ brand:"T-Rex 民宿", tagline:"R&F 民宿 @ T-Rex", subtitle:"富力公主湾 · 富力新天地", all_projects:"全部项目", filter_all:"全部", filter_studio:"开间", filter_1br:"一卧室", filter_2br:"两卧室", filter_3br:"三卧室", filter_dk:"双钥匙", available:"可预订", booked:"已订满", per_night:"/ 晚", weekday:"平日", weekend:"周末", max_guests:"最多", back:"← 返回", book_now:"立即预订", view_details:"查看详情", amenities:"设施", booking_title:"预订申请", checkin:"入住日期", checkout:"退房日期", guestname:"您的姓名", phone:"联系电话", submit:"发送预订申请", contact_title:"完成预订", contact_sub:"我们将在1小时内通过 WhatsApp 或微信确认。", wa_btn:"通过 WhatsApp 发送", wechat_title:"微信联系", scan_qr:"扫码添加微信", wechat_id_label:"微信号", summary:"预订摘要", nights:"晚", weekday_nights:"平日晚", weekend_nights:"周末晚", total:"预计总价", fill_all:"请填写所有字段。", date_err:"请选择有效日期。", footer:"© 2025 T-Rex 民宿. 版权所有。", reviews:"客人评价", no_reviews:"暂无评价，欢迎第一个留言！", leave_review:"撰写评价", your_name:"您的姓名", your_rating:"评分", your_comment:"您的评价", submit_review:"提交评价", admin:"管理", admin_title:"后台管理", add_property:"添加房源", edit:"编辑", delete:"删除", save:"保存", cancel:"取消", upload_imgs:"上传图片", prop_name_en:"名称（英文）", prop_name_zh:"名称（中文）", prop_desc_en:"描述（英文）", prop_desc_zh:"描述（中文）", prop_price_wd:"平日价格（RM）", prop_price_we:"周末价格（RM）", prop_unit:"单位号", prop_type:"房型", prop_project:"楼盘", prop_status:"状态", prop_maxguests:"最多入住人数", prop_amenities:"设施（逗号分隔）", logout:"退出", login:"后台登录", password:"密码", login_btn:"登录", wrong_pw:"密码错误。", found:"个结果", loading:"加载中...", saving:"保存中..." },
};

const genId = () => Date.now() + Math.random();
const today = () => new Date().toISOString().split("T")[0];
const isWeekend = (dateStr) => { const d = new Date(dateStr).getDay(); return d===0||d===5||d===6; };
const calcTotal = (ci, co, pwd, pwe) => {
  if (!ci||!co) return {total:0,weekdayNights:0,weekendNights:0};
  const days = Math.round((new Date(co)-new Date(ci))/86400000);
  if (days<=0) return {total:0,weekdayNights:0,weekendNights:0};
  let total=0,weekendNights=0,weekdayNights=0;
  for (let i=0;i<days;i++) {
    const d=new Date(ci); d.setDate(d.getDate()+i);
    const ds=d.toISOString().split("T")[0];
    if(isWeekend(ds)){total+=Number(pwe);weekendNights++;}
    else{total+=Number(pwd);weekdayNights++;}
  }
  return {total,weekdayNights,weekendNights};
};

const Stars = ({n,size=16}) => <span style={{fontSize:size}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#f59e0b":"#ddd"}}>★</span>)}</span>;

function DisclaimerModal({lang,onClose}) {
  const zh=lang==="zh";
  const sections=zh?[
    ["订单成立条件","客户通过本网站提交的任何预订请求，仅为意向表达。只有当我们的工作人员通过 WhatsApp、微信或其他正式通讯渠道明确确认后，订单方告成立。"],
    ["信息准确性","我们尽力确保房源描述和照片与实际相符，但可能存在轻微视觉差异。"],
    ["责任限制","对于因不可抗力导致的预订延迟或无法入住，我方在法律允许范围内不承担赔偿责任。"],
    ["第三方链接","本网站包含的第三方服务链接，其可用性和隐私政策不在我方控制范围内。"],
    ["知识产权","网站上所有内容未经书面许可，不得复制或用于商业用途。"],
    ["更新与变更","我们保留随时修改本免责声明的权利，恕不另行通知。"],
  ]:[
    ["Booking Confirmation","Any booking request is only an expression of interest confirmed only once our staff explicitly responds via WhatsApp, WeChat, or another official channel."],
    ["Accuracy of Information","We strive to ensure accuracy though slight differences may arise due to lighting or furniture adjustments."],
    ["Limitation of Liability","We shall not be held liable for failures caused by force majeure or third-party service interruptions."],
    ["Third-Party Links","Linked external platforms' availability and privacy practices are beyond our control."],
    ["Intellectual Property","All content may not be copied or used commercially without written permission."],
    ["Changes","We reserve the right to modify this disclaimer at any time without prior notice."],
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,maxWidth:720,width:"100%",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{position:"sticky",top:0,background:"#0a1628",borderRadius:"20px 20px 0 0",padding:"18px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#fff"}}>{zh?"免责声明":"Disclaimer"}</h2>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"24px 28px"}}>
          <p style={{fontSize:14,lineHeight:1.8,color:"#444",marginTop:0}}>{zh?"本网站所展示的所有房源信息仅供展示与参考之用，不构成任何即时预订确认或合同承诺。":"All property listings are for informational purposes only and do not constitute a real-time booking confirmation."}</p>
          {sections.map(([t,c])=><div key={t} style={{marginBottom:16}}><h4 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:"#0f2d5a"}}>{t}</h4><p style={{margin:0,fontSize:13,lineHeight:1.8,color:"#555"}}>{c}</p></div>)}
          <p style={{fontSize:13,color:"#888",marginTop:20,borderTop:"1px solid #eee",paddingTop:16}}>{zh?<>如有疑问，请通过 WhatsApp <strong>+6013-7700776</strong> 或微信联系我们。</>:<>Questions? Contact us via WhatsApp <strong>+6013-7700776</strong> or WeChat.</>}</p>
        </div>
      </div>
    </div>
  );
}

function Navbar({lang,setLang,tx,onHome,onAdmin}) {
  return (
    <nav style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid #eee",position:"sticky",top:0,zIndex:200}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <button onClick={onHome} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO} alt="logo" style={{height:40,width:40,objectFit:"contain",borderRadius:6}}/>
          <span style={{fontSize:17,fontWeight:800,color:"#111"}}>{tx.brand}</span>
        </button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {["en","zh"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid",fontSize:12,fontWeight:700,cursor:"pointer",borderColor:lang===l?"#111":"#ddd",background:lang===l?"#111":"#fff",color:lang===l?"#fff":"#666"}}>{l==="en"?"EN":"中文"}</button>)}
          <button onClick={onAdmin} style={{padding:"5px 13px",borderRadius:20,border:"1.5px solid #e0e0e0",fontSize:12,fontWeight:600,cursor:"pointer",background:"#fff",color:"#888"}}>⚙️ {tx.admin}</button>
        </div>
      </div>
    </nav>
  );
}

function Hero({tx,lang}) {
  return (
    <div style={{position:"relative",color:"#fff",textAlign:"center",padding:"56px 20px 48px",overflow:"hidden",minHeight:300}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"url(https://i.postimg.cc/MZ3D3nXp/1122.png)",backgroundSize:"cover",backgroundPosition:"center 40%"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(10,22,40,0.55) 0%,rgba(10,22,40,0.45) 60%,rgba(10,22,40,0.65) 100%)"}}/>
      <div style={{position:"relative"}}>
        <img src={LOGO} alt="logo" style={{height:72,width:72,objectFit:"contain",marginBottom:12,borderRadius:8}}/>
        <h1 style={{fontSize:30,fontWeight:900,margin:"0 0 10px",textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>{tx.tagline}</h1>
        <p style={{fontSize:15,color:"#d0e8ff",margin:"0 0 20px",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>{tx.subtitle}</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          {Object.entries(PROJECTS).map(([k,v])=>(
            <div key={k} style={{background:"rgba(255,255,255,0.15)",borderRadius:12,padding:"10px 20px",border:"1px solid rgba(255,255,255,0.3)",backdropFilter:"blur(6px)"}}>
              <span>{v.icon}</span><span style={{marginLeft:8,fontWeight:700,fontSize:14}}>{lang==="zh"?v.zh:v.en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterBar({project,setProject,filter,setFilter,tx,lang,count}) {
  const projs=[{key:"ALL",en:tx.all_projects,zh:tx.all_projects},...Object.entries(PROJECTS).map(([k,v])=>({key:k,en:v.en,zh:v.zh}))];
  const types=[["All",tx.filter_all],["Studio",tx.filter_studio],["1 Bedroom",tx.filter_1br],["2 Bedrooms",tx.filter_2br],["3 Bedrooms",tx.filter_3br],["Dual Key",tx.filter_dk]];
  const btn=(active,fn,label,sm)=><button onClick={fn} style={{padding:sm?"6px 14px":"7px 18px",borderRadius:24,border:"1.5px solid",fontSize:sm?12:13,fontWeight:600,cursor:"pointer",borderColor:active?"#0f2d5a":"#e0e0e0",background:active?"#0f2d5a":"#fff",color:active?"#fff":"#555"}}>{label}</button>;
  return (
    <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"16px 20px",position:"sticky",top:58,zIndex:100}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{projs.map(p=>btn(project===p.key,()=>setProject(p.key),lang==="zh"?p.zh:p.en,false))}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {types.map(([k,l])=>btn(filter===k,()=>setFilter(k),l,true))}
          <span style={{marginLeft:"auto",fontSize:12,color:"#999"}}>{count} {tx.found}</span>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({p,lang,tx,onClick}) {
  const name=lang==="zh"?p.name_zh:p.name_en;
  const avail=p.status==="available";
  const avg=p.reviews?.length?(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length).toFixed(1):null;
  const proj=PROJECTS[p.project];
  return (
    <div onClick={()=>avail&&onClick(p)} style={{borderRadius:16,overflow:"hidden",background:"#fff",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",cursor:avail?"pointer":"default",transition:"transform .2s,box-shadow .2s",opacity:avail?1:0.7}}
      onMouseEnter={e=>{if(avail){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.13)";}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}>
      <div style={{position:"relative",height:200,overflow:"hidden",background:"#f0f0f0"}}>
        <img src={p.cover} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",top:10,left:10,background:avail?"#16a34a":"#dc2626",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{avail?tx.available:tx.booked}</div>
        {proj&&<div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{proj.icon} {lang==="zh"?proj.zh:proj.en}</div>}
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:8,marginBottom:2}}>
          <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#111",lineHeight:1.3}}>{name}</h3>
          <span style={{background:"#f3f4f6",borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:600,color:"#555",whiteSpace:"nowrap"}}>{p.type}</span>
        </div>
        <p style={{margin:"4px 0 8px",fontSize:12,color:"#999"}}>🔑 {p.unit}</p>
        {avg&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}><Stars n={Math.round(avg)} size={13}/><span style={{fontSize:12,color:"#666"}}>{avg} ({p.reviews.length})</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div><span style={{fontSize:12,color:"#555"}}>{tx.weekday}: </span><span style={{fontSize:17,fontWeight:800,color:"#0f2d5a"}}>RM {p.priceWeekday}</span></div>
          <div><span style={{fontSize:12,color:"#555"}}>{tx.weekend}: </span><span style={{fontSize:17,fontWeight:800,color:"#c2410c"}}>RM {p.priceWeekend}</span></div>
        </div>
        <p style={{margin:"4px 0 8px",fontSize:11,color:"#aaa"}}>👥 {tx.max_guests} {p.maxGuests}</p>
        {avail&&<button style={{marginTop:8,width:"100%",padding:"9px 0",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{tx.view_details}</button>}
      </div>
    </div>
  );
}

function Carousel({images}) {
  const [idx,setIdx]=useState(0);
  useEffect(()=>setIdx(0),[images]);
  const imgs=images||[];
  return (
    <div style={{position:"relative",borderRadius:16,overflow:"hidden",background:"#000",marginBottom:24}}>
      <img src={imgs[idx]} alt="" style={{width:"100%",height:360,objectFit:"cover",display:"block"}}/>
      {imgs.length>1&&<>
        <button onClick={()=>setIdx((idx-1+imgs.length)%imgs.length)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.88)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:"pointer",fontWeight:700}}>‹</button>
        <button onClick={()=>setIdx((idx+1)%imgs.length)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.88)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:20,cursor:"pointer",fontWeight:700}}>›</button>
        <div style={{position:"absolute",bottom:10,right:14,background:"rgba(0,0,0,0.45)",color:"#fff",borderRadius:20,padding:"2px 9px",fontSize:11}}>{idx+1}/{imgs.length}</div>
      </>}
    </div>
  );
}

function ReviewSection({p,lang,tx,onAdd}) {
  const [show,setShow]=useState(false);
  const [name,setName]=useState(""); const [rating,setRating]=useState(5);
  const [comment,setComment]=useState(""); const [hover,setHover]=useState(0);
  const submit=()=>{
    if(!name.trim()||!comment.trim()) return;
    onAdd(p.id,{author:name,rating,date:today(),text_en:comment,text_zh:comment});
    setName("");setComment("");setRating(5);setShow(false);
  };
  return (
    <div style={{marginTop:32}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h3 style={{margin:0,fontSize:17,fontWeight:700}}>💬 {tx.reviews} ({p.reviews?.length||0})</h3>
        <button onClick={()=>setShow(!show)} style={{padding:"7px 16px",borderRadius:20,border:"1.5px solid #0f2d5a",background:show?"#0f2d5a":"#fff",color:show?"#fff":"#0f2d5a",fontWeight:600,fontSize:13,cursor:"pointer"}}>✏️ {tx.leave_review}</button>
      </div>
      {show&&(
        <div style={{background:"#f8faff",borderRadius:14,padding:20,marginBottom:20,border:"1px solid #e0e8f8"}}>
          <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>{tx.your_name}</label><input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,boxSizing:"border-box"}}/></div>
          <div style={{marginBottom:12}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>{tx.your_rating}</label><div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(i=><span key={i} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(i)} style={{fontSize:28,cursor:"pointer",color:i<=(hover||rating)?"#f59e0b":"#ddd"}}>★</span>)}</div></div>
          <div style={{marginBottom:14}}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>{tx.your_comment}</label><textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></div>
          <button onClick={submit} style={{padding:"9px 24px",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.submit_review}</button>
        </div>
      )}
      {!p.reviews?.length?<p style={{color:"#aaa",fontSize:14}}>{tx.no_reviews}</p>:(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[...p.reviews].reverse().map((r,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:12,padding:"14px 16px",border:"1px solid #eee"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#0f2d5a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{r.author[0].toUpperCase()}</div>
                <div><div style={{fontWeight:700,fontSize:14}}>{r.author}</div><div style={{display:"flex",alignItems:"center",gap:6}}><Stars n={r.rating} size={13}/><span style={{fontSize:11,color:"#aaa"}}>{r.date}</span></div></div>
              </div>
              <p style={{margin:0,fontSize:14,color:"#444",lineHeight:1.6}}>{lang==="zh"?r.text_zh:r.text_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailPage({p,lang,tx,onBook,onBack,onAddReview}) {
  const name=lang==="zh"?p.name_zh:p.name_en;
  const desc=lang==="zh"?p.desc_zh:p.desc_en;
  const ams=lang==="zh"?p.amenities_zh:p.amenities_en;
  const proj=PROJECTS[p.project];
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"24px 20px 48px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#555",fontWeight:600,marginBottom:18,padding:0}}>{tx.back}</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
        {proj&&<span style={{background:"#e8f0fe",color:"#0f2d5a",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700}}>{proj.icon} {lang==="zh"?proj.zh:proj.en}</span>}
        <span style={{background:"#f3f4f6",color:"#555",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:600}}>{p.type}</span>
        <span style={{background:p.status==="available"?"#dcfce7":"#fee2e2",color:p.status==="available"?"#16a34a":"#dc2626",borderRadius:20,padding:"3px 12px",fontSize:12,fontWeight:700}}>{p.status==="available"?tx.available:tx.booked}</span>
      </div>
      <h2 style={{margin:"4px 0",fontSize:24,fontWeight:800,color:"#111"}}>{name}</h2>
      <p style={{margin:"0 0 20px",color:"#888",fontSize:13}}>🔑 {p.unit} · 👥 {tx.max_guests} {p.maxGuests}</p>
      <Carousel images={p.images}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:28}}>
        <div>
          <p style={{fontSize:15,lineHeight:1.8,color:"#444",margin:"0 0 20px"}}>{desc}</p>
          <h4 style={{margin:"0 0 10px",fontSize:15,fontWeight:700}}>{tx.amenities}</h4>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>{(ams||[]).map(a=><span key={a} style={{background:"#f3f4f6",borderRadius:20,padding:"5px 13px",fontSize:13,color:"#444"}}>{AMI[a]||"✓"} {a}</span>)}</div>
          <ReviewSection p={p} lang={lang} tx={tx} onAdd={onAddReview}/>
        </div>
        <div style={{alignSelf:"start",position:"sticky",top:120}}>
          <div style={{background:"#fff",border:"1.5px solid #e5e7eb",borderRadius:16,padding:22,boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
            <div style={{marginBottom:6}}><span style={{fontSize:13,color:"#666"}}>{tx.weekday}: </span><span style={{fontSize:22,fontWeight:800,color:"#0f2d5a"}}>RM {p.priceWeekday}</span><span style={{fontSize:13,color:"#aaa"}}> {tx.per_night}</span></div>
            <div style={{marginBottom:12}}><span style={{fontSize:13,color:"#666"}}>{tx.weekend}: </span><span style={{fontSize:22,fontWeight:800,color:"#c2410c"}}>RM {p.priceWeekend}</span><span style={{fontSize:13,color:"#aaa"}}> {tx.per_night}</span></div>
            <div style={{background:"#f8faff",borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#666"}}>📅 {lang==="zh"?"周末 = 周五、周六、周日晚":"Weekend = Fri, Sat, Sun nights"}</div>
            {p.reviews?.length>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}><Stars n={Math.round(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length)} size={15}/><span style={{fontSize:13,color:"#666"}}>{(p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length).toFixed(1)} ({p.reviews.length})</span></div>}
            <button onClick={()=>onBook(p)} disabled={p.status!=="available"} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:p.status==="available"?"linear-gradient(135deg,#0f2d5a,#1a5aad)":"#ddd",color:"#fff",fontWeight:700,fontSize:15,cursor:p.status==="available"?"pointer":"not-allowed"}}>{tx.book_now}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingPage({p,lang,tx,onBack}) {
  const [ci,setCi]=useState(""); const [co,setCo]=useState("");
  const [name,setName]=useState(""); const [phone,setPhone]=useState("");
  const [step,setStep]=useState(1); const [err,setErr]=useState("");
  const pname=lang==="zh"?p.name_zh:p.name_en;
  const {total,weekdayNights,weekendNights}=calcTotal(ci,co,p.priceWeekday,p.priceWeekend);
  const totalNights=weekdayNights+weekendNights;
  const submit=()=>{
    if(!name.trim()||!phone.trim()){setErr(tx.fill_all);return;}
    if(!ci||!co||totalNights<=0){setErr(tx.date_err);return;}
    setErr("");setStep(2);
  };
  const waMsg=encodeURIComponent(`Hi T-Rex Homestay!\n🏠 Unit: ${pname} (${p.unit})\n📅 Check-in: ${ci}\n📅 Check-out: ${co}\n🌙 ${weekdayNights} weekday night(s) × RM${p.priceWeekday} + ${weekendNights} weekend night(s) × RM${p.priceWeekend}\n👤 Name: ${name}\n📞 Phone: ${phone}\n💰 Est. Total: RM ${total}\n\nPlease confirm. Thank you!`);
  const inp={width:"100%",padding:"11px 13px",borderRadius:10,border:"1.5px solid #e0e0e0",fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"};
  return (
    <div style={{maxWidth:580,margin:"0 auto",padding:"24px 20px 48px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#555",fontWeight:600,marginBottom:20,padding:0}}>{tx.back}</button>
      {step===1?(
        <>
          <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800}}>{tx.booking_title}</h2>
          <p style={{margin:"0 0 16px",color:"#888",fontSize:13}}>🏠 {pname} · 🔑 {p.unit}</p>
          <div style={{background:"#f8faff",borderRadius:10,padding:"8px 14px",marginBottom:16,fontSize:12,color:"#555",border:"1px solid #e0e8f8"}}>
            📅 {lang==="zh"
              ? `周末价（RM ${p.priceWeekend}）= 周五、周六、周日晚  |  平日价（RM ${p.priceWeekday}）= 其余晚`
              : `Weekend (RM ${p.priceWeekend}) = Fri/Sat/Sun  |  Weekday (RM ${p.priceWeekday}) = other nights`}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.checkin}</label><input type="date" value={ci} onChange={e=>setCi(e.target.value)} style={inp} min={today()}/></div>
            <div><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.checkout}</label><input type="date" value={co} onChange={e=>setCo(e.target.value)} style={inp} min={ci||today()}/></div>
          </div>
          <div style={{marginBottom:12}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.guestname}</label><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Zhang Wei" style={inp}/></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:5,color:"#333"}}>{tx.phone}</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+60 1X-XXXXXXX" style={inp}/></div>
          {totalNights>0&&(
            <div style={{background:"#eff6ff",borderRadius:12,padding:"14px 16px",marginBottom:14,border:"1px solid #bfdbfe"}}>
              <p style={{margin:"0 0 8px",fontWeight:700,fontSize:13,color:"#1e40af"}}>{tx.summary}</p>
              {weekdayNights>0&&<p style={{margin:"2px 0",fontSize:13,color:"#444"}}>{weekdayNights} {tx.weekday_nights} × RM {p.priceWeekday} = RM {weekdayNights*p.priceWeekday}</p>}
              {weekendNights>0&&<p style={{margin:"2px 0",fontSize:13,color:"#444"}}>{weekendNights} {tx.weekend_nights} × RM {p.priceWeekend} = RM {weekendNights*p.priceWeekend}</p>}
              <p style={{margin:"8px 0 0",fontWeight:700,fontSize:14,color:"#1e40af",borderTop:"1px solid #bfdbfe",paddingTop:8}}>{tx.total}: <strong>RM {total}</strong></p>
            </div>
          )}
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
            <p style={{margin:"2px 0",fontSize:13,color:"#444"}}>🏠 {pname} ({p.unit})</p>
            <p style={{margin:"2px 0",fontSize:13,color:"#444"}}>📅 {ci} → {co}</p>
            {weekdayNights>0&&<p style={{margin:"2px 0",fontSize:13,color:"#444"}}>{weekdayNights} {tx.weekday_nights} × RM {p.priceWeekday} = RM {weekdayNights*p.priceWeekday}</p>}
            {weekendNights>0&&<p style={{margin:"2px 0",fontSize:13,color:"#444"}}>{weekendNights} {tx.weekend_nights} × RM {p.priceWeekend} = RM {weekendNights*p.priceWeekend}</p>}
            <p style={{margin:"6px 0 0",fontWeight:700,fontSize:14,color:"#15803d"}}>{tx.total}: RM {total}</p>
            <p style={{margin:"2px 0",fontSize:13,color:"#444"}}>👤 {name} · {phone}</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:12,background:"#25d366",color:"#fff",fontWeight:700,fontSize:16,textDecoration:"none",marginBottom:18}}>💬 {tx.wa_btn}</a>
          <div style={{background:"#fff",border:"1px solid #eee",borderRadius:16,padding:20,marginBottom:14}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>📱 WhatsApp QR</p>
            <img src={WA_QR} alt="WA" style={{width:160,height:160,borderRadius:10,objectFit:"cover",display:"block",margin:"8px auto"}}/>
            <p style={{margin:"8px 0 0",fontSize:13,color:"#555"}}>+{WHATSAPP_NUMBER}</p>
          </div>
          <div style={{background:"#fff",border:"1px solid #eee",borderRadius:16,padding:20}}>
            <p style={{margin:"0 0 4px",fontWeight:700,fontSize:14}}>🟢 {tx.wechat_title}</p>
            <img src={WX_QR} alt="WX" style={{width:160,height:160,borderRadius:10,objectFit:"cover",display:"block",margin:"8px auto"}}/>
            <p style={{margin:"8px 0 0",fontSize:13,color:"#555"}}>{tx.wechat_id_label}: <strong>{WECHAT_ID}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminLogin({tx,onLogin}) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  const go=()=>pw===ADMIN_PW?onLogin():setErr(tx.wrong_pw);
  return (
    <div style={{maxWidth:360,margin:"80px auto",padding:32,background:"#fff",borderRadius:20,boxShadow:"0 4px 32px rgba(0,0,0,0.1)",textAlign:"center"}}>
      <img src={LOGO} style={{height:60,width:60,objectFit:"contain",marginBottom:12,borderRadius:8}}/>
      <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800}}>{tx.login}</h2>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={tx.password} style={{width:"100%",padding:"12px",borderRadius:10,border:"1.5px solid #e0e0e0",fontSize:14,boxSizing:"border-box",marginBottom:10}}/>
      {err&&<p style={{color:"#ef4444",fontSize:13,marginBottom:8}}>{err}</p>}
      <button onClick={go} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>{tx.login_btn}</button>
    </div>
  );
}

function AdminPanel({tx,lang,properties,onUpdate,onLogout,saving}) {
  const [editId,setEditId]=useState(null); const [adding,setAdding]=useState(false);
  const fileRef=useRef(); const [uploading,setUploading]=useState(false);
  const blank={id:genId(),project:"RF_PRINCESS",unit:"",type:"Studio",name_en:"",name_zh:"",desc_en:"",desc_zh:"",priceWeekday:200,priceWeekend:250,status:"available",maxGuests:2,cover:"",images:[],amenities_en:[],amenities_zh:[],reviews:[]};
  const [form,setForm]=useState({...blank,amenities_en_str:"",amenities_zh_str:""});
  const startEdit=p=>{setForm({...p,images:p.images||[],amenities_en:p.amenities_en||[],amenities_zh:p.amenities_zh||[],amenities_en_str:(p.amenities_en||[]).join(", "),amenities_zh_str:(p.amenities_zh||[]).join(", ")});setEditId(p.id);setAdding(false);};
  const startAdd=()=>{setForm({...blank,id:genId(),amenities_en_str:"",amenities_zh_str:""});setAdding(true);setEditId(null);};
  const cancel=()=>{setEditId(null);setAdding(false);};
  const doSave=()=>{
    const u={...form,amenities_en:(form.amenities_en_str||"").split(",").map(s=>s.trim()).filter(Boolean),amenities_zh:(form.amenities_zh_str||"").split(",").map(s=>s.trim()).filter(Boolean),priceWeekday:Number(form.priceWeekday),priceWeekend:Number(form.priceWeekend),maxGuests:Number(form.maxGuests)};
    if(!u.cover&&u.images.length) u.cover=u.images[0];
    if(adding) onUpdate([...properties,u]);
    else onUpdate(properties.map(p=>p.id===editId?u:p));
    cancel();
  };
  const del=id=>{if(window.confirm("Delete?")) onUpdate(properties.filter(p=>p.id!==id));};
  const handleImgUpload=async e=>{
    setUploading(true);
    for(const f of Array.from(e.target.files)){
      try{ const url=await uploadImage(f); setForm(prev=>({...prev,images:[...(prev.images||[]),url],cover:prev.cover||url})); }
      catch{ alert("Upload failed"); }
    }
    setUploading(false);
  };
  const removeImg=i=>setForm(prev=>{const imgs=(prev.images||[]).filter((_,j)=>j!==i);return{...prev,images:imgs,cover:imgs[0]||""};});
  const inp={width:"100%",padding:"9px 11px",borderRadius:8,border:"1.5px solid #e0e0e0",fontSize:13,boxSizing:"border-box",fontFamily:"inherit"};
  const lbl={display:"block",fontSize:12,fontWeight:600,color:"#555",marginBottom:4};
  const grouped=Object.keys(PROJECTS).reduce((acc,k)=>{acc[k]=properties.filter(p=>p.project===k);return acc;},{});
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px 48px"}}>
      {(editId||adding)&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
          <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:640,margin:"auto"}}>
            <h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800}}>{adding?tx.add_property:tx.edit}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={lbl}>{tx.prop_project}</label><select value={form.project} onChange={e=>setForm(f=>({...f,project:e.target.value}))} style={inp}>{Object.entries(PROJECTS).map(([k,v])=><option key={k} value={k}>{lang==="zh"?v.zh:v.en}</option>)}</select></div>
              <div><label style={lbl}>{tx.prop_unit}</label><input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} style={inp} placeholder="e.g. A-12-03"/></div>
              <div><label style={lbl}>{tx.prop_type}</label><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={inp}>{ROOM_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={lbl}>{tx.prop_status}</label><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={inp}><option value="available">{tx.available}</option><option value="booked">{tx.booked}</option></select></div>
              <div><label style={lbl}>{tx.prop_price_wd} (Mon–Thu)</label><input type="number" value={form.priceWeekday} onChange={e=>setForm(f=>({...f,priceWeekday:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>{tx.prop_price_we} (Fri–Sun)</label><input type="number" value={form.priceWeekend} onChange={e=>setForm(f=>({...f,priceWeekend:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>{tx.prop_maxguests}</label><input type="number" value={form.maxGuests} onChange={e=>setForm(f=>({...f,maxGuests:e.target.value}))} style={inp}/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_name_en}</label><input value={form.name_en} onChange={e=>setForm(f=>({...f,name_en:e.target.value}))} style={inp}/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_name_zh}</label><input value={form.name_zh} onChange={e=>setForm(f=>({...f,name_zh:e.target.value}))} style={inp}/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_desc_en}</label><textarea value={form.desc_en} onChange={e=>setForm(f=>({...f,desc_en:e.target.value}))} rows={2} style={inp}/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_desc_zh}</label><textarea value={form.desc_zh} onChange={e=>setForm(f=>({...f,desc_zh:e.target.value}))} rows={2} style={inp}/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_amenities} (EN)</label><input value={form.amenities_en_str} onChange={e=>setForm(f=>({...f,amenities_en_str:e.target.value}))} style={inp} placeholder="WiFi, Air Con, Sea View"/></div>
              <div style={{gridColumn:"span 2"}}><label style={lbl}>{tx.prop_amenities} (ZH)</label><input value={form.amenities_zh_str} onChange={e=>setForm(f=>({...f,amenities_zh_str:e.target.value}))} style={inp} placeholder="WiFi, 空调, 海景"/></div>
            </div>
            <div style={{marginTop:16}}>
              <label style={lbl}>🖼️ {tx.upload_imgs}</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImgUpload} style={{display:"none"}}/>
              <button onClick={()=>fileRef.current.click()} disabled={uploading} style={{padding:"8px 18px",borderRadius:8,border:"1.5px dashed #0f2d5a",background:uploading?"#e0e7ff":"#f0f4ff",color:"#0f2d5a",fontWeight:600,fontSize:13,cursor:uploading?"wait":"pointer"}}>{uploading?"⏳ 上传中...":"+ 上传图片"}</button>
              <span style={{fontSize:11,color:"#aaa",marginLeft:10}}>支持多张，自动上传云端</span>
              {form.images?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>{form.images.map((img,i)=><div key={i} style={{position:"relative"}}><img src={img} alt="" style={{width:72,height:72,objectFit:"cover",borderRadius:8,border:i===0?"2.5px solid #0f2d5a":"1px solid #ddd"}}/>{i===0&&<span style={{position:"absolute",bottom:2,left:2,background:"#0f2d5a",color:"#fff",fontSize:9,borderRadius:4,padding:"1px 4px"}}>封面</span>}<button onClick={()=>removeImg(i)} style={{position:"absolute",top:-6,right:-6,background:"#ef4444",color:"#fff",border:"none",borderRadius:"50%",width:18,height:18,fontSize:11,cursor:"pointer",lineHeight:1}}>×</button></div>)}</div>}
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={doSave} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:"#0f2d5a",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.save}</button>
              <button onClick={cancel} style={{flex:1,padding:"11px 0",borderRadius:10,border:"1.5px solid #ddd",background:"#fff",color:"#555",fontWeight:700,fontSize:14,cursor:"pointer"}}>{tx.cancel}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:800}}>⚙️ {tx.admin_title} {saving&&<span style={{fontSize:14,color:"#888",fontWeight:400}}>· {tx.saving}</span>}</h2>
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
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {props.map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:14,border:"1px solid #eee",overflow:"hidden"}}>
                <div style={{position:"relative",height:130}}>
                  {p.cover?<img src={p.cover} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"#f0f4f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>🏠</div>}
                  <div style={{position:"absolute",top:8,right:8,background:p.status==="available"?"#16a34a":"#dc2626",color:"#fff",borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700}}>{p.status==="available"?tx.available:tx.booked}</div>
                </div>
                <div style={{padding:"12px 14px"}}>
                  <p style={{margin:"0 0 2px",fontWeight:700,fontSize:13}}>{lang==="zh"?p.name_zh:p.name_en}</p>
                  <p style={{margin:"0 0 4px",fontSize:11,color:"#aaa"}}>🔑 {p.unit} · {p.type}</p>
                  <p style={{margin:"0 0 10px",fontSize:11,color:"#555"}}>平日 RM{p.priceWeekday} · 周末 RM{p.priceWeekend}</p>
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

export default function App() {
  const [lang,setLang]=useState("zh");
  const [project,setProject]=useState("ALL");
  const [filter,setFilter]=useState("All");
  const [page,setPage]=useState("home");
  const [selected,setSelected]=useState(null);
  const [properties,setProperties]=useState(DEFAULT_PROPS);
  const [isAdmin,setIsAdmin]=useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [showDisclaimer,setShowDisclaimer]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const handleSyncToCF=async()=>{
    setSyncing(true);
    const ok=await syncToCF(properties);
    setSyncing(false);
    alert(ok?`✅ 同步成功！${properties.length} 个房源已同步到全球CDN，中国客户可以访问了。`:"❌ 同步失败，请重试。");
  };
  const tx=T[lang];

  useEffect(()=>{
    // 先尝试 Firebase，失败则用 Cloudflare KV
    loadFromCloud().then(async d=>{
      if(d && d.length > 0){
        setProperties(d);
      } else {
        const cf = await loadFromCF();
        if(cf) setProperties(cf);
      }
      setLoading(false);
    });
  },[]);
  const updateProperties=async p=>{
    setProperties([...p]);
    setSaving(true);
    await saveToCloud(p);
    // 同步到 Cloudflare KV
    await syncToCF(p);
    setSaving(false);
  };
  const addReview=(pid,review)=>{
    const updated=properties.map(p=>p.id===pid?{...p,reviews:[...(p.reviews||[]),review]}:p);
    updateProperties(updated);
    if(selected?.id===pid) setSelected(updated.find(p=>p.id===pid));
  };
  const filtered=properties.filter(p=>(project==="ALL"||p.project===project)&&(filter==="All"||p.type===filter));
  const nav=(pg,prop=null)=>{setPage(pg);if(prop)setSelected(prop);window.scrollTo(0,0);};

  if(loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:"#f8fafc",fontFamily:"'Segoe UI',system-ui,sans-serif"}}><img src={LOGO} style={{height:80,width:80,objectFit:"contain",borderRadius:10}}/><p style={{color:"#888"}}>{T[lang].loading}</p></div>;
  if(showLogin&&!isAdmin) return <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Segoe UI',system-ui,sans-serif"}}><Navbar lang={lang} setLang={setLang} tx={tx} onHome={()=>{setShowLogin(false);setPage("home");}} onAdmin={()=>{}}/><AdminLogin tx={tx} onLogin={()=>{setIsAdmin(true);setShowLogin(false);setPage("admin");}}/></div>;

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Navbar lang={lang} setLang={setLang} tx={tx} onHome={()=>nav("home")} onAdmin={()=>{if(isAdmin)nav("admin");else setShowLogin(true);}}/>
      {page==="home"&&<>
        <Hero tx={tx} lang={lang}/>
        <FilterBar project={project} setProject={setProject} filter={filter} setFilter={setFilter} tx={tx} lang={lang} count={filtered.length}/>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px 48px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:22}}>
            {filtered.map(p=><PropertyCard key={p.id} p={p} lang={lang} tx={tx} onClick={prop=>nav("detail",prop)}/>)}
          </div>
          {filtered.length===0&&<p style={{textAlign:"center",color:"#aaa",padding:"60px 0"}}>No properties found.</p>}
        </div>
      </>}
      {page==="detail"&&selected&&<DetailPage p={properties.find(p=>p.id===selected.id)||selected} lang={lang} tx={tx} onBook={p=>nav("booking",p)} onBack={()=>nav("home")} onAddReview={addReview}/>}
      {page==="booking"&&selected&&<BookingPage p={selected} lang={lang} tx={tx} onBack={()=>nav("detail",selected)}/>}
      {page==="admin"&&isAdmin&&<>
        <div style={{background:"#fff3cd",border:"1px solid #ffc107",borderRadius:10,padding:"12px 20px",margin:"16px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <strong>🌍 同步到全球CDN</strong>
            <p style={{fontSize:12,color:"#666",margin:"2px 0 0"}}>点击同步后，中国客户也能看到最新房源和图片</p>
          </div>
          <button onClick={handleSyncToCF} disabled={syncing} style={{padding:"10px 24px",borderRadius:10,border:"none",background:syncing?"#ccc":"#f59e0b",color:"#fff",fontWeight:700,fontSize:14,cursor:syncing?"wait":"pointer",whiteSpace:"nowrap"}}>
            {syncing?"⏳ 同步中...":"🔄 立即同步到中国"}
          </button>
        </div>
        <AdminPanel tx={tx} lang={lang} properties={properties} onUpdate={updateProperties} onLogout={()=>{setIsAdmin(false);setPage("home");}} saving={saving}/>
      </>}
      <footer style={{background:"#0a1628",color:"#556",textAlign:"center",padding:"22px 20px",fontSize:12}}>
        <img src={LOGO} alt="" style={{height:20,width:20,objectFit:"contain",verticalAlign:"middle",marginRight:6,borderRadius:3}}/>
        <span style={{color:"#7eb3e8",fontWeight:700}}>{tx.brand}</span> &nbsp;·&nbsp; {tx.footer}
        &nbsp;·&nbsp;
        <button onClick={()=>setShowDisclaimer(true)} style={{background:"none",border:"none",color:"#7eb3e8",fontSize:12,cursor:"pointer",textDecoration:"underline",padding:0}}>{lang==="zh"?"免责声明":"Disclaimer"}</button>
      </footer>
      {showDisclaimer&&<DisclaimerModal lang={lang} onClose={()=>setShowDisclaimer(false)}/>}
    </div>
  );
}
