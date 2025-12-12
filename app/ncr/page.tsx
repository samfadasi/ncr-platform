"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../lib/useLanguage";

type NCRRow = {
  id: number;
  ncr_number: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

function formatDate(value: string | null, locale: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function NCRListPage() {
  const { lang, toggle, t, dir } = useLanguage();
  const locale = lang === "ar" ? "ar-SA" : "en-US";

  const [rows, setRows] = useState<NCRRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);

    const { data, error } = await supabase
      .from("ncr_reports")
      .select("id,ncr_number,description,status,created_at")
      .order("id", { ascending: false });

    if (error) {
      setErr(error.message);
      setRows([]);
    } else {
      setRows((data as NCRRow[]) ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const a = (r.ncr_number ?? "").toLowerCase();
      const b = (r.description ?? "").toLowerCase();
      return a.includes(needle) || b.includes(needle);
    });
  }, [q, rows]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    background: "#fafafa",
    direction: dir,
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  };

  const btnStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  };

  const primaryBtn: React.CSSProperties = {
    ...btnStyle,
    border: "1px solid #111",
    background: "#111",
    color: "white",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    border: "1px solid #eee",
    borderRadius: 12,
    overflow: "hidden",
  };

  const thTd: React.CSSProperties = {
    padding: 12,
    borderBottom: "1px solid #eee",
    textAlign: dir === "rtl" ? "right" : "left",
    verticalAlign: "top",
    fontSize: 14,
  };

  return (
    <main style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: 28 }}>{t("ncr_list")}</h1>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={toggle} style={btnStyle}>
            {lang === "ar" ? t("lang_en") : t("lang_ar")}
          </button>

          <button onClick={load} style={btnStyle}>
            {t("refresh")}
          </button>

          <Link href="/ncr/new" style={{ textDecoration: "none" }}>
            <span style={primaryBtn}>{t("new_ncr")}</span>
          </Link>
        </div>
      </div>

      <input
        style={inputStyle}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("search_placeholder")}
      />

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <div>{t("loading")}</div>
        ) : err ? (
          <div style={{ color: "crimson" }}>
            {t("error_loading")}: {err}
          </div>
        ) : filtered.length === 0 ? (
          <div>{t("no_records")}</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTd}>{t("ncr_number")}</th>
                <th style={thTd}>{t("description")}</th>
                <th style={thTd}>{t("status")}</th>
                <th style={thTd}>{t("created_at")}</th>
                <th style={thTd}>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={thTd}>{r.ncr_number ?? ""}</td>
                  <td style={thTd}>{r.description ?? ""}</td>
                  <td style={thTd}>{r.status ?? ""}</td>
                  <td style={thTd}>{formatDate(r.created_at, locale)}</td>
                  <td style={thTd}>
                    <Link href={`/ncr/${r.id}`}>{t("view")}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
