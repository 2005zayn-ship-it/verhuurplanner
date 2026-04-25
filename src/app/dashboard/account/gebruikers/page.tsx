"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Rol = "Beheerder" | "Manager" | "Gebruiker" | "Medewerker";

interface Gebruiker {
  email: string;
  rol: Rol;
  isHuidigeGebruiker: boolean;
}

const ROL_MATRIX: { recht: string; beheerder: boolean; manager: boolean; gebruiker: boolean; medewerker: boolean }[] = [
  { recht: "Boekingen inzien",           beheerder: true,  manager: true,  gebruiker: true,  medewerker: true  },
  { recht: "Prijzen inzien",             beheerder: true,  manager: true,  gebruiker: true,  medewerker: false },
  { recht: "Boekingen aanpassen",        beheerder: true,  manager: true,  gebruiker: true,  medewerker: false },
  { recht: "Boekingsstatus wijzigen",    beheerder: true,  manager: true,  gebruiker: true,  medewerker: false },
  { recht: "Gebruikers beheren",         beheerder: true,  manager: true,  gebruiker: false, medewerker: false },
  { recht: "Kalenders synchroniseren",   beheerder: true,  manager: false, gebruiker: false, medewerker: false },
  { recht: "Kalenders wijzigen",         beheerder: true,  manager: false, gebruiker: false, medewerker: false },
  { recht: "Online kalender aanpassen",  beheerder: true,  manager: false, gebruiker: false, medewerker: false },
];

const ROL_OPTIES: Rol[] = ["Beheerder", "Manager", "Gebruiker", "Medewerker"];

export default function GebruikersPage() {
  const [gebruikers, setGebruikers] = useState<Gebruiker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRol, setInviteRol] = useState<Rol>("Gebruiker");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("naam, email")
        .eq("id", user.id)
        .single();

      setGebruikers([
        {
          email: profile?.email ?? user.email ?? "",
          rol: "Beheerder",
          isHuidigeGebruiker: true,
        },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6 animate-pulse">
        <div className="h-5 bg-warm-100 rounded w-48 mb-6" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-9 bg-warm-50 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-warm-900">Gebruikersbeheer</h1>
        <p className="text-warm-500 text-sm mt-1">Geef anderen toegang tot je kalenders.</p>
      </div>

      {/* Gebruikerslijst */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-warm-900">Gebruikers</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Gebruiker toevoegen
          </button>
        </div>

        <div className="rounded-xl border border-warm-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-warm-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide">E-mailadres</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-warm-500 uppercase tracking-wide">Rol</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {gebruikers.map((g, i) => (
                <tr key={i} className="hover:bg-warm-50 transition-colors">
                  <td className="px-4 py-3 text-warm-800">
                    {g.email}
                    {g.isHuidigeGebruiker && (
                      <span className="ml-2 text-xs bg-accent-light text-accent px-2 py-0.5 rounded-full font-medium">
                        Huidige gebruiker
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warm-100 text-warm-700">
                      {g.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!g.isHuidigeGebruiker && (
                      <button className="text-xs text-warm-400 hover:text-red-500 transition-colors">Verwijderen</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rechtentabel */}
      <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-warm-900 mb-4">Rechten per rol</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-100">
                <th className="text-left py-2 pr-6 text-warm-600 font-medium">Recht</th>
                {ROL_OPTIES.map((rol) => (
                  <th key={rol} className="text-center py-2 px-3 text-warm-600 font-medium whitespace-nowrap">{rol}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {ROL_MATRIX.map((row) => (
                <tr key={row.recht} className="hover:bg-warm-50 transition-colors">
                  <td className="py-3 pr-6 text-warm-700">{row.recht}</td>
                  {([row.beheerder, row.manager, row.gebruiker, row.medewerker] as boolean[]).map((heeft, i) => (
                    <td key={i} className="py-3 px-3 text-center">
                      {heeft ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600 mx-auto">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-warm-300 mx-auto">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-warm-900/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-warm-100 shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-warm-900">Gebruiker uitnodigen</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-warm-400 hover:text-warm-600 rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1.5">E-mailadres</label>
                <input
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white placeholder:text-warm-300"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="gebruiker@voorbeeld.be"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-warm-600 mb-1.5">Rol</label>
                <select
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:ring-1 focus:ring-accent focus:border-accent text-sm text-warm-900 bg-white"
                  value={inviteRol}
                  onChange={(e) => setInviteRol(e.target.value as Rol)}
                >
                  {ROL_OPTIES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
              Uitnodigingen versturen is binnenkort beschikbaar.
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 border border-warm-200 text-warm-700 hover:bg-warm-50 rounded-xl text-sm font-medium transition-colors"
              >
                Annuleren
              </button>
              <button
                disabled
                className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl text-sm opacity-50 cursor-not-allowed"
              >
                Uitnodiging versturen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
