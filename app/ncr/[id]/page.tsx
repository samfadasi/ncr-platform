"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

type Lang = "en" | "ar";

const translations = {
  en: {
    title: "NCR Details",
    back: "Back to List",
    toggle: "AR",
    loading: "Loading...",
    notFound: "NCR not found.",
    ncrNumber: "NCR Number",
    description: "Description",
    status: "Status",
    createdAt: "Created At",
    id: "Record ID",
  },
  ar: {
    title: "تفاصيل NCR",
    back: "الرجوع للقائمة",
    toggle: "EN",
    loading: "جاري التحميل...",
    notFound: "السجل غير موجود.",
    ncrNumber: "رقم NCR",
    description: "الوصف",
    status: "الحالة",
    createdAt: "تاريخ الإنشاء",
    id: "معرّف السجل",
  },
};

type NCR = {
  id: number;
  ncr_number: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

export default function NCRDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<NCR | null>(null);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("ncr_reports")
        .select("id,ncr_number,description,status,created_at")
        .eq("id", Number(id))
        .single();

      setRow((data as NCR) || null);
      setLoading(false);
    };

    load();
  }, [id]);

  const fieldStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
    background: "white",
  };

  return (
    <main dir={dir} style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{t.title}</h1>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            style={{ padding: "6px 12px", cursor: "pointer" }}
          >
            {t.toggle}
          </button>

          <Link href="/ncr">
            <button style={{ padding: "6px 12px", cursor: "pointer" }}>
              ← {t.back}
            </button>
          </Link>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <p style={{ marginTop: 20 }}>{t.loading}</p>
      ) : !row ? (
        <div style={{ marginTop: 20 }}>
          <p>{t.notFound}</p>
          <button onClick={() => router.push("/ncr")} style={{ padding: "8px 12px", cursor: "pointer" }}>
            {t.back}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          <div style={fieldStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.ncrNumber}</div>
            <div>{row.ncr_number ?? ""}</div>
          </div>

          <div style={fieldStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.description}</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{row.description ?? ""}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={fieldStyle}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.status}</div>
              <div>{row.status ?? ""}</div>
            </div>

            <div style={fieldStyle}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.createdAt}</div>
              <div>{row.created_at ? row.created_at.slice(0, 16).replace("T", " ") : ""}</div>
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.id}</div>
            <div>{row.id}</div>
          </div>
        </div>
      )}
    </main>
  );
}
