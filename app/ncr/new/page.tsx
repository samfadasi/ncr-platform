"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function nextFromLast(last?: string | null) {
  // expected: NCR-001
  if (!last) return "NCR-001";
  const m = last.match(/(\d+)$/);
  if (!m) return "NCR-001";
  const num = parseInt(m[1], 10);
  if (Number.isNaN(num)) return "NCR-001";
  return `NCR-${pad3(num + 1)}`;
}

export default function NewNcrPage() {
  const router = useRouter();

  const [loadingNo, setLoadingNo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ncrNumber, setNcrNumber] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadNextNumber = async () => {
      setError(null);
      setLoadingNo(true);

      const { data, error } = await supabase
        .from("ncr_reports")
        .select("ncr_number")
        .order("opened_at", { ascending: false })
        .limit(1);

      if (error) {
        // fallback safe value
        setNcrNumber("NCR-001");
        setLoadingNo(false);
        return;
      }

      const last = data?.[0]?.ncr_number ?? null;
      setNcrNumber(nextFromLast(last));
      setLoadingNo(false);
    };

    loadNextNumber();
  }, []);

  const canSave = useMemo(() => {
    return !loadingNo && !saving && ncrNumber.trim() !== "" && description.trim() !== "";
  }, [loadingNo, saving, ncrNumber, description]);

  const saveNcr = async () => {
    setError(null);
    setSaving(true);

    const payload = {
      ncr_number: ncrNumber.trim(),
      description: description.trim(),
      status: "open",
      // opened_at: let DB default or Supabase timestamp trigger, otherwise uncomment:
      // opened_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("ncr_reports").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/ncr");
  };

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>New NCR</h1>
        <Link href="/ncr" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>NCR Number</label>
        <input
          value={ncrNumber}
          onChange={(e) => setNcrNumber(e.target.value)}
          disabled={loadingNo || saving}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none",
          }}
          placeholder={loadingNo ? "Generating..." : "NCR-001"}
        />
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
          Auto-generated from the latest NCR. You can edit if needed.
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
          rows={6}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none",
            resize: "vertical",
          }}
          placeholder="Write the NCR description..."
        />
      </div>

      <button
        onClick={saveNcr}
        disabled={!canSave}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #111",
          background: canSave ? "#111" : "#999",
          color: "white",
          cursor: canSave ? "pointer" : "not-allowed",
          fontWeight: 700,
        }}
      >
        {saving ? "Saving..." : "Save NCR"}
      </button>
    </div>
  );
}
