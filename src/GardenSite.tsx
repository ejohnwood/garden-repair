"use client";

import { useEffect, useMemo, useState } from "react";
import { HardwareSupplies } from "./HardwareSupplies";

type Line = { id: string; category: string; material: string; length: string; qty: number; purpose: string };

const lockedLines: Line[] = [
  { id: "o-rear", category: "Outer retaining wall", material: "2×6", length: "120\"", qty: 3, purpose: "Rear" },
  { id: "o-side", category: "Outer retaining wall", material: "2×6", length: "69\"", qty: 6, purpose: "Sides" },
  { id: "o-front", category: "Outer retaining wall", material: "2×6", length: "48\"", qty: 6, purpose: "Front sections" },
  { id: "i-rear", category: "Interior bed", material: "2×6", length: "81\"", qty: 3, purpose: "Rear" },
  { id: "i-side", category: "Interior bed", material: "2×6", length: "30\"", qty: 6, purpose: "Sides" },
  { id: "i-return", category: "Interior bed", material: "2×6", length: "25\"", qty: 6, purpose: "Front returns" },
  { id: "i-connector", category: "Interior bed", material: "2×6", length: "18\"", qty: 6, purpose: "Gate-post connectors" },
  { id: "rail-rear", category: "Top rail", material: "2×4", length: "120\"", qty: 1, purpose: "Rear top rail" },
  { id: "rail-side", category: "Top rail", material: "2×4", length: "69\"", qty: 2, purpose: "Side top rails" },
  { id: "rail-front", category: "Top rail", material: "2×4", length: "48\"", qty: 2, purpose: "Front top rails" },
  { id: "post-outer", category: "Posts", material: "4×4", length: "48\"", qty: 9, purpose: "Corners, gate, side midpoints, rear midpoint" },
  { id: "post-inner", category: "Posts", material: "4×4", length: "16½\"", qty: 6, purpose: "Interior ground-contact supports" },
];

const gateLines: Line[] = [
  { id: "gate-stiles", category: "Gate leaf", material: "2×2", length: "46½\"", qty: 2, purpose: "Hinge and latch stiles" },
  { id: "gate-rails", category: "Gate leaf", material: "2×2", length: "20\"", qty: 4, purpose: "Top, bottom, and touching middle pair" },
];

export function GardenSite() {
  const [explodedLoaded, setExplodedLoaded] = useState(false);
  const [frameView, setFrameView] = useState<"assembled" | "exploded">("assembled");
  const [lines, setLines] = useState<Line[]>(lockedLines);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gate, setGate] = useState<Line[]>(gateLines);
  const [editingGate, setEditingGate] = useState(false);
  const [savedGate, setSavedGate] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem("garden-spec-draft-v2");
    if (draft) try { setLines(JSON.parse(draft)); } catch { /* retain locked data */ }
    const gateDraft = localStorage.getItem("garden-gate-spec-draft");
    if (gateDraft) try { setGate(JSON.parse(gateDraft)); } catch { /* retain locked gate data */ }
  }, []);

  const totals = useMemo(() => lines.reduce<Record<string, number>>((all, line) => {
    all[line.material] = (all[line.material] || 0) + Number(line.qty || 0); return all;
  }, {}), [lines]);

  const gateTotals = useMemo(() => gate.reduce<Record<string, number>>((all, line) => {
    all[line.material] = (all[line.material] || 0) + Number(line.qty || 0); return all;
  }, {}), [gate]);

  function update(id: string, field: keyof Line, value: string) {
    setLines(current => current.map(line => line.id === id ? { ...line, [field]: field === "qty" ? Number(value) : value } : line));
    setSaved(false);
  }

  function saveDraft() {
    localStorage.setItem("garden-spec-draft-v2", JSON.stringify(lines));
    setSaved(true); setEditing(false);
  }

  function resetDraft() {
    setLines(lockedLines); localStorage.removeItem("garden-spec-draft-v2"); setSaved(false); setEditing(false);
  }

  function cancelEdit() {
    const draft = localStorage.getItem("garden-spec-draft-v2");
    if (draft) try { setLines(JSON.parse(draft)); } catch { setLines(lockedLines); }
    else setLines(lockedLines);
    setEditing(false);
  }

  function updateGate(id: string, field: keyof Line, value: string) {
    setGate(current => current.map(line => line.id === id ? { ...line, [field]: field === "qty" ? Number(value) : value } : line));
    setSavedGate(false);
  }

  function saveGateDraft() {
    localStorage.setItem("garden-gate-spec-draft", JSON.stringify(gate));
    setSavedGate(true); setEditingGate(false);
  }

  function resetGateDraft() {
    setGate(gateLines); localStorage.removeItem("garden-gate-spec-draft"); setSavedGate(false); setEditingGate(false);
  }

  function cancelGateEdit() {
    const draft = localStorage.getItem("garden-gate-spec-draft");
    if (draft) try { setGate(JSON.parse(draft)); } catch { setGate(gateLines); }
    else setGate(gateLines);
    setEditingGate(false);
  }

  function exportPdf() {
    const previousTitle = document.title;
    document.title = "Garden Build List";
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.print();
  }

  return <main>
    <header className="simple-header">
      <div><h1>Garden Frame</h1><span className="print-title">Lumber & hardware build list</span></div>
      <div className="header-tools"><a href="#hardware" className="hardware-jump">Hardware list ↓</a><p>120″ wide × 72″ deep × 48″ high</p><button type="button" onClick={exportPdf}>Export build list PDF</button></div>
    </header>

    <section className="model-section" id="model">
      <div className="section-head"><div><p className="eyebrow">1 / DESIGN</p><h2>Interactive frame model</h2></div><p>Drag to orbit. Use the controls for top view and measurements. The gate is not part of this frame specification.</p></div>
      <div className="model-view-tabs" role="group" aria-label="Frame model view">
        <button type="button" className={frameView === "assembled" ? "" : "quiet"} aria-pressed={frameView === "assembled"} onClick={() => setFrameView("assembled")}>Original view</button>
        <button type="button" className={frameView === "exploded" ? "" : "quiet"} aria-pressed={frameView === "exploded"} onClick={() => { setExplodedLoaded(true); setFrameView("exploded"); }}>Exploded view</button>
      </div>
      <div className="model-shell" hidden={frameView !== "assembled"}><iframe src={import.meta.env.BASE_URL + "garden-model.html"} title="Interactive 3D garden frame model" loading="eager"/></div>
      {explodedLoaded && <div className="model-shell" hidden={frameView !== "exploded"}><iframe src={import.meta.env.BASE_URL + "garden-exploded.html"} title="Exploded garden frame model with component inspection"/></div>}
      <div className="dimension-strip"><span>Footprint <b>120″ × 72″ max</b></span><span>Planting band <b>18″ clear</b></span><span>Gate allowance <b>24″ clear</b></span><span>Retaining height <b>16½″ actual</b></span></div>
    </section>

    <section className="model-section gate-model-section" id="gate-model">
      <div className="section-head"><div><p className="eyebrow">2 / GATE DESIGN</p><h2>Interactive gate model</h2></div><p>Separate gate-leaf model with two reference 4×4 posts. The dummy posts are not included in the gate lumber list.</p></div>
      <div className="model-shell"><iframe src={import.meta.env.BASE_URL + "garden-gate-model.html"} title="Interactive 3D garden gate model" loading="lazy"/></div>
      <div className="dimension-strip"><span>Clear opening <b>24″</b></span><span>Gate leaf <b>23″ wide</b></span><span>Installed top <b>48″ high</b></span><span>Bottom clearance <b>1½″</b></span></div>
    </section>

    <section className="spec-section" id="spec">
      <div className="section-head"><div><p className="eyebrow">3 / FRAME MATERIALS</p><h2>Frame materials specification</h2></div><div className="actions">{editing ? <><button className="quiet" onClick={cancelEdit}>Cancel</button><button className="quiet" onClick={resetDraft}>Reset</button><button onClick={saveDraft}>Save changes</button></> : <button onClick={() => setEditing(true)}>Edit spec</button>}</div></div>
      <p className="note">This lumber will be used in ground-contact conditions. Dimensions below are exact requested cut lengths, not store-stock optimization. {saved && <b>Your draft is saved on this device.</b>}</p>
      <div className="table-wrap"><table><thead><tr><th>Assembly</th><th>Lumber</th><th>Cut length</th><th>Qty</th><th>Purpose</th></tr></thead><tbody>{lines.map(line => <tr key={line.id}><td>{line.category}</td><td>{editing ? <input value={line.material} onChange={e => update(line.id,"material",e.target.value)}/> : line.material}</td><td>{editing ? <input value={line.length} onChange={e => update(line.id,"length",e.target.value)}/> : line.length}</td><td>{editing ? <input type="number" min="0" value={line.qty} onChange={e => update(line.id,"qty",e.target.value)}/> : line.qty}</td><td>{editing ? <input value={line.purpose} onChange={e => update(line.id,"purpose",e.target.value)}/> : line.purpose}</td></tr>)}</tbody></table></div>
      <div className="totals">{Object.entries(totals).map(([material, qty]) => <div key={material}><strong>{qty}</strong><span>pieces of {material}</span></div>)}</div>
      <p className="fineprint">Nominal lumber sizes. Typical actual cross-sections: 2×6 = 1½″ × 5½″; 2×4 = 1½″ × 3½″; 4×4 = 3½″ × 3½″.</p>
    </section>

    <section className="spec-section gate-spec-section" id="gate-spec">
      <div className="section-head"><div><p className="eyebrow">4 / GATE MATERIALS</p><h2>Gate lumber specification</h2></div><div className="actions">{editingGate ? <><button className="quiet" onClick={cancelGateEdit}>Cancel</button><button className="quiet" onClick={resetGateDraft}>Reset</button><button onClick={saveGateDraft}>Save changes</button></> : <button onClick={() => setEditingGate(true)}>Edit spec</button>}</div></div>
      <p className="note"><span className="screen-only">Gate leaf only. Dummy 4×4 posts, welded wire, hinges, latch, anti-sag cable, brackets, screws, and other hardware are excluded.</span><span className="print-only">Gate leaf only. Welded wire, hinges, latch, anti-sag cable, brackets, screws, and other hardware are excluded.</span> {savedGate && <b>Your draft is saved on this device.</b>}</p>
      <div className="table-wrap"><table><thead><tr><th>Assembly</th><th>Lumber</th><th>Cut length</th><th>Qty</th><th>Purpose</th></tr></thead><tbody>{gate.map(line => <tr key={line.id}><td>{line.category}</td><td>{editingGate ? <input value={line.material} onChange={e => updateGate(line.id,"material",e.target.value)}/> : line.material}</td><td>{editingGate ? <input value={line.length} onChange={e => updateGate(line.id,"length",e.target.value)}/> : line.length}</td><td>{editingGate ? <input type="number" min="0" value={line.qty} onChange={e => updateGate(line.id,"qty",e.target.value)}/> : line.qty}</td><td>{editingGate ? <input value={line.purpose} onChange={e => updateGate(line.id,"purpose",e.target.value)}/> : line.purpose}</td></tr>)}</tbody></table></div>
      <div className="totals">{Object.entries(gateTotals).map(([material, qty]) => <div key={material}><strong>{qty}</strong><span>pieces of {material}</span></div>)}</div>
      <p className="fineprint">Finished gate leaf: 23″ wide × 46½″ high. Installed 1½″ above the pad for a 48″ top alignment. Nominal 2×2 lumber is approximately 1½″ × 1½″ actual.</p>
    </section>

    <HardwareSupplies />
    <footer>Garden frame, gate, and hardware build list</footer>
  </main>;
}
