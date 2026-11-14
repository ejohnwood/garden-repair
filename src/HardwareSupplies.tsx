import { useEffect, useRef, useState } from "react";

type Item = {
  id: string; group: "Frame / enclosure" | "Gate"; name: string;
  quantity: string; purpose: string; specification: string; note?: string;
  image: string; source: string; conditional?: boolean;
};
const items: Item[] = [
  {id:"structural-screws",group:"Frame / enclosure",name:"Structural wood screws",quantity:"Count & size TBD",purpose:"Attach retaining boards and rails to posts.",specification:"Exterior, treated-wood compatible; select diameter, length, and pattern after reviewing each joint.",image:"https://www.fastenersplus.com/cdn/shop/files/SDWS22400DB-RP1-FlatHeadStructuralScrew-Main-1_1pack.jpg?v=1756907510",source:"https://www.fastenersplus.com/products/0220-x-4-strong-tie-sdws22400db-rp1-timber-screw-double-barrier-coating-pkg-1"},
  {id:"angle-brackets",group:"Frame / enclosure",name:"Angle brackets",quantity:"If needed · count TBD",purpose:"Reinforce joints with limited access for direct fastening.",specification:"Select dimensions and corrosion protection for the actual joint and wood treatment.",note:"The pictured bracket illustrates the shape; its coating is not a selected specification.",conditional:true,image:"https://www.fastenersplus.com/cdn/shop/files/A21.01_7a2fa653-e9a1-414c-b3a9-4dbefdb0246e.jpg?v=1772032172",source:"https://www.fastenersplus.com/products/simpson-a21-2-x-1-1-2-angle-g90-galvanized"},
  {id:"connector-screws",group:"Frame / enclosure",name:"Connector screws",quantity:"Per selected brackets",purpose:"Fasten metal connectors to the wood.",specification:"Use the connector manufacturer's approved screw size, coating, and installation schedule.",note:"Only needed if connectors are selected; not interchangeable with general wood screws.",conditional:true,image:"https://www.fastenersplus.com/cdn/shop/files/SD9112SS-R100-ConnectorScrew-Main-1_100pack.jpg?v=1756820790",source:"https://www.fastenersplus.com/collections/simpson-sd-connector-screws"},
  {id:"wire-mesh",group:"Frame / enclosure",name:"Welded-wire mesh",quantity:"Roll size TBD",purpose:"Fill the upper enclosure panels and gate.",specification:"Confirm mesh opening, wire gauge, roll width, and cutting allowance before choosing a roll.",note:"Image illustrates mesh, not the final opening size.",image:"https://i5.walmartimages.com/seo/Hardware-Cloth-1-2-inch-60-in-x-50-ft-19-Gauge-Hot-Dip-Galvanized-Welding-Welded-Wire-Mesh-Roll-Chicken-Wire-Fencing-Cage-Wire-Rodent-Mesh-Rabbit-Wir_6a0169b9-8b1a-44e6-a313-8b815bdeb63e.74bab735e2fce9fd41d0989672b7f908.jpeg?odnBg=FFFFFF&odnHeight=576&odnWidth=576",source:"https://www.walmart.com/ip/10724068752"},
  {id:"fence-staples",group:"Frame / enclosure",name:"Fencing staples",quantity:"Alternative A · count TBD",purpose:"Attach wire mesh to the wooden frame.",specification:"Exterior staples compatible with the treatment and mesh; confirm length and spacing.",note:"Choose staples OR screws with washers as the main mesh attachment method.",conditional:true,image:"https://www.hardwareworld.com/files/pi/bT/Z/EC10.jpg",source:"https://www.hardwareworld.com/pirui4g/Prime-Source-Galvanized-Fence-Staple-11-4-1-Lb"},
  {id:"mesh-screws",group:"Frame / enclosure",name:"Mesh screws & washers",quantity:"Alternative B · count TBD",purpose:"Clamp mesh against the frame for a removable attachment.",specification:"Compatible exterior screws and retaining washers; match washer size to the mesh opening.",note:"Alternative to staples. Image shows a screw-fastening example; finalize the retaining washer separately.",conditional:true,image:"https://power-pro.com/cdn/shop/files/Shopify_Gallery_2.png?v=1718906439",source:"https://power-pro.com/collections/all"},
  {id:"hinges",group:"Gate",name:"Gate hinges",quantity:"3 hinges · proposed",purpose:"Hang the outward-swinging gate on the right post.",specification:"Fit the 1.5-inch actual stile width, post face, clearances, and gate weight.",note:"Pictured T-hinge is a style reference; mounting geometry must be checked against the narrow 2x2 frame.",image:"https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/852b2261-b0b5-4286-a6ca-cca349a49562?_mzcb=_1703879152693",source:"https://www.acehardware.com/departments/hardware/door-hardware/door-hinges/5005864"},
  {id:"latch",group:"Gate",name:"Gate latch",quantity:"1 latch · proposed",purpose:"Hold the gate closed at the left post.",specification:"Confirm mounting footprint, opening direction, and operation from both sides.",image:"https://images.national-hardware.com/is/image/nh/nh_166028_ip2?%24nhwProductMedium%24=&op_sharpen=1",source:"https://www.national-hardware.com/p/1103-rustic-modern-gate-latch"},
  {id:"handle",group:"Gate",name:"Pull handle",quantity:"1 · if not part of latch",purpose:"Provide a comfortable grip for opening and closing.",specification:"Choose a compact handle whose screw holes fit the 2x2 stile.",conditional:true,image:"https://mobileimages.lowes.com/productimages/7af223f0-aba9-4593-bf43-e58cdbfed4b1/62249291.jpg?size=pdhism",source:"https://www.lowes.com/pd/National-Hardware-Black-Gate-pull/5014203999"},
  {id:"anti-sag",group:"Gate",name:"Anti-sag cable & turnbuckle",quantity:"1 system · proposed",purpose:"Keep the gate square and allow tension adjustment.",specification:"Cable runs from the upper hinge corner to the lower latch corner. Confirm all fittings fit the 23-inch-wide gate.",note:"Do not assume a full-size gate kit will fit this narrow gate.",image:"https://images.national-hardware.com/is/image/nh/n166-004_360?%24nhwProductMedium%24=&op_sharpen=1",source:"https://www.national-hardware.com/p/852-anti-sag-gate-kits?model=N166-004"},
  {id:"corner-plates",group:"Gate",name:"Corner reinforcement",quantity:"Up to 4 corners · TBD",purpose:"Reinforce the gate frame's corner joints.",specification:"Select plates with screw holes that land fully on the 1.5-inch actual lumber faces.",note:"May overlap with the anti-sag kit's brackets. Check included parts before buying.",conditional:true,image:"https://images.thdstatic.com/productImages/8aa73a05-6f90-4b1b-9d3e-f9a68657aac0/svn/everbilt-corner-braces-12744-64_1000.jpg",source:"https://www.homedepot.com/p/315016077"},
  {id:"gate-stop",group:"Gate",name:"Gate stop",quantity:"1 stop · proposed",purpose:"Give the closed gate a firm resting point.",specification:"Fit to the latch post without narrowing the opening or obstructing the outward swing.",image:"https://mobileimages.lowes.com/productimages/e00c3f5c-977b-4b26-baad-ae92b85880cb/10309347.jpg?size=pdhism",source:"https://www.lowes.com/pd/Freedom-Boerboel-4-1-4-in-Black-Gate-Stop/1000738802"},
  {id:"mounting-fasteners",group:"Gate",name:"Hardware mounting fasteners",quantity:"Per chosen hardware",purpose:"Install hinges, latch, handle, and bracing.",specification:"Use each hardware manufacturer's specified fasteners; confirm wood thickness, penetration, and compatible metals.",note:"Account for included screws before buying additional packs. Bolt image is illustrative only.",image:"https://www.martellhardware.com/Hardware/Snug-Cottage/Fasteners/Carriage-Bolts/Snug-Cottage-FP-CB540-G-Carriage-Bolt.jpg",source:"https://www.martellhardware.com/accessories/fasteners/snug-cottage-fp-cb540-g-steel-carriage-bolt-nut-washer-pack-hot-dipped-galvanized-finish-1-2-x-4-l.aspx"}
];
const storageKey = "garden-hardware-purchased-v1";
const groups = ["Frame / enclosure", "Gate"] as const;

function HardwareImage({item,large=false}:{item:Item;large?:boolean}) {
  const [failed,setFailed] = useState(false);
  return failed ? <span className="hardware-image-fallback">Photo unavailable<br/>See example link</span> :
    <img src={item.image} alt={item.name + " — representative example"} loading={large?"eager":"lazy"} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>;
}

export function HardwareSupplies() {
  const [purchased,setPurchased] = useState<Record<string,boolean>>({});
  const [storageMessage,setStorageMessage] = useState("");
  const [filter,setFilter] = useState("all");
  const [preview,setPreview] = useState<Item|null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    try {
      const stored=JSON.parse(localStorage.getItem(storageKey)||"{}");
      if(stored && typeof stored==="object" && !Array.isArray(stored))
        setPurchased(Object.fromEntries(items.map(item=>[item.id,stored[item.id]===true])));
    } catch { setStorageMessage("Purchase tracking is available for this visit; saved data could not be loaded."); }
  },[]);
  useEffect(()=>{
    if(preview && dialog.current && !dialog.current.open) dialog.current.showModal();
  },[preview]);
  function toggle(id:string) {
    const next={...purchased,[id]:!purchased[id]};
    setPurchased(next);
    try {localStorage.setItem(storageKey,JSON.stringify(next));setStorageMessage("");}
    catch {setStorageMessage("Purchase changes could not be saved on this device.");}
  }
  function closePreview(){dialog.current?.close();setPreview(null);}
  const bought=items.filter(item=>purchased[item.id]).length;
  const visible=items.filter(item=>filter==="all" || (filter==="remaining"?!purchased[item.id]:item.group===filter));
  return <section className="spec-section hardware-section" id="hardware">
    <div className="section-head">
      <div><p className="eyebrow">5 / HARDWARE &amp; SUPPLIES</p><h2>Everything that holds it together</h2></div>
      <p>Proposed hardware for the frame, enclosure, and gate. Photos show the hardware type; linked products are examples, not confirmed selections.</p>
    </div>
    <div className="hardware-summary screen-only">
      <span><strong>{bought} / {items.length}</strong> items marked purchased</span>
      <span>Selections &amp; quantities pending joint and fit checks</span>
    </div>
    <p className="hardware-guidance">Use fasteners and hardware compatible with the treated lumber and wet conditions. Match fastener coatings to their connectors. Select either staples or screws with washers for mesh attachment; conditional items may not be needed.</p>
    <p className="hardware-storage screen-only" role="status">{storageMessage || "Purchase checkboxes are saved on this device. Marking an item purchased does not confirm its specification."}</p>
    <div className="hardware-filters screen-only" role="group" aria-label="Filter hardware">
      {[["all","All items"],["Frame / enclosure","Frame / enclosure"],["Gate","Gate"],["remaining","Still to buy"]].map(([value,label])=><button key={value} type="button" className={filter===value?"":"quiet"} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}</button>)}
    </div>
    <div className="hardware-screen screen-only">
      {groups.map(group=>{
        const groupItems=visible.filter(item=>item.group===group);
        return groupItems.length>0 && <div className="hardware-group" key={group}>
          <h3>{group}<span>{groupItems.length} items</span></h3>
          <div className="hardware-grid">{groupItems.map(item=><article className={"hardware-card"+(purchased[item.id]?" is-purchased":"")} key={item.id}>
            <button className="hardware-thumbnail" type="button" onClick={()=>setPreview(item)} aria-label={"Enlarge example of "+item.name}><HardwareImage item={item}/><span>Enlarge ↗</span></button>
            <div className="hardware-card-body">
              <div className="hardware-badges"><span>Proposed</span>{item.conditional&&<span className="conditional">Conditional</span>}</div>
              <h4>{item.name}</h4><p className="hardware-purpose">{item.purpose}</p>
              <p className="hardware-quantity">{item.quantity}</p>
              <details className="hardware-details"><summary>Specification &amp; fit notes</summary><p>{item.specification}</p>{item.note&&<p>{item.note}</p>}</details>
              <div className="hardware-card-footer"><a href={item.source} target="_blank" rel="noreferrer">Example &amp; photo source ↗</a><label><input type="checkbox" checked={!!purchased[item.id]} onChange={()=>toggle(item.id)}/>Purchased</label></div>
            </div>
          </article>)}</div>
        </div>;
      })}
      {!visible.length&&<p className="hardware-empty">All listed items are marked purchased.</p>}
    </div>
    <div className="hardware-print print-only">
      {groups.map(group=><div key={group}><h3>{group}</h3><table><thead><tr><th>Item / status</th><th>Proposed quantity</th><th>Purpose &amp; specification</th><th>Purchased</th></tr></thead><tbody>{items.filter(item=>item.group===group).map(item=><tr key={item.id}><td>{item.name}<br/><small>Proposed{item.conditional?" · Conditional":""}</small></td><td>{item.quantity}</td><td>{item.purpose} {item.specification} {item.note}</td><td>{purchased[item.id]?"Yes":"No"}</td></tr>)}</tbody></table></div>)}
    </div>
    <dialog ref={dialog} className="hardware-dialog screen-only" aria-labelledby="hardware-preview-title" onCancel={()=>setPreview(null)} onClick={e=>{if(e.target===dialog.current)closePreview();}}>
      {preview&&<><div className="hardware-dialog-header"><div><p className="eyebrow">REPRESENTATIVE EXAMPLE</p><h3 id="hardware-preview-title">{preview.name}</h3></div><button type="button" className="quiet" onClick={closePreview} aria-label="Close image preview">Close ✕</button></div><div className="hardware-large-image"><HardwareImage key={preview.id} item={preview} large/></div><p>{preview.specification}</p><a href={preview.source} target="_blank" rel="noreferrer">View example &amp; photo source ↗</a></>}
    </dialog>
  </section>;
}
