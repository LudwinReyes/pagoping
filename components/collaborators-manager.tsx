"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Edit3, Loader2, Plus, Trash2, UserPlus, Users, Volume2, X } from "lucide-react"
import type { Collaborator } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CollaboratorsManagerProps {
  maxCollaborators: number
  initialCount?: number
}

const normalizePhoneForInput = (phone: string) => phone.replace(/^\+51/, "")

export function CollaboratorsManager({ maxCollaborators, initialCount = 0 }: CollaboratorsManagerProps) {
  const [open, setOpen] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Collaborator | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const request = useCallback(async (payload: Record<string, unknown>) => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch("/api/collaborators", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "No se pudo completar la operación")
    return result
  }, [])

  const loadCollaborators = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const result = await request({ action: "list" })
      setCollaborators(result.collaborators || [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los colaboradores")
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (open) void loadCollaborators()
  }, [open, loadCollaborators])

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setName("")
    setPhone("")
    setPassword("")
    setError("")
  }

  const startCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const startEdit = (collaborator: Collaborator) => {
    setEditing(collaborator)
    setName(collaborator.name)
    setPhone(normalizePhoneForInput(collaborator.phone_number))
    setPassword("")
    setError("")
    setShowForm(true)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const payload = editing
        ? { action: "update", collaborator_id: editing.id, name, phone_number: phone }
        : { action: "create", name, phone_number: phone, password }
      await request(payload)
      resetForm()
      await loadCollaborators()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el colaborador")
    } finally {
      setSaving(false)
    }
  }

  const setActive = async (collaborator: Collaborator, active: boolean) => {
    setError("")
    setCollaborators((current) => current.map((item) => item.id === collaborator.id ? { ...item, is_active: active } : item))
    try {
      await request({ action: "set_active", collaborator_id: collaborator.id, is_active: active })
    } catch (cause) {
      setCollaborators((current) => current.map((item) => item.id === collaborator.id ? collaborator : item))
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar el estado")
    }
  }

  const remove = async (collaborator: Collaborator) => {
    if (!window.confirm(`¿Eliminar a ${collaborator.name}? Ya no podrá ingresar a PagoPing.`)) return
    setSaving(true)
    setError("")
    try {
      await request({ action: "delete", collaborator_id: collaborator.id })
      setCollaborators((current) => current.filter((item) => item.id !== collaborator.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo eliminar el colaborador")
    } finally {
      setSaving(false)
    }
  }

  const assignedCount = open && !loading ? collaborators.length : initialCount
  const available = Math.max(maxCollaborators - assignedCount, 0)
  const initials = useMemo(() => (value: string) => value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), [])

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetForm() }}>
      <DialogTrigger asChild>
        <button id="collaborators-manager-trigger" className="relative col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white p-3.5 transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:gap-3 sm:p-5 md:p-6">
          <div className="rounded-xl bg-purple-100 p-2.5 dark:bg-purple-900/50 sm:p-3">
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 sm:h-6 sm:w-6" />
          </div>
          <span className="text-center text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">Colaboradores</span>
          <span className="text-center text-[11px] text-purple-600 dark:text-purple-400 sm:text-xs">{assignedCount} / {maxCollaborators} asignados</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[94vw] overflow-y-auto rounded-3xl p-4 sm:max-w-xl sm:p-6">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl"><Users className="h-5 w-5 text-purple-600" /> Colaboradores</DialogTitle>
              <DialogDescription>Administra las cuentas que escuchan las alertas de tu negocio.</DialogDescription>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{available} disponibles</Badge>
          </div>
        </DialogHeader>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        {showForm ? (
          <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{editing ? "Editar colaborador" : "Crear colaborador"}</h3>
              <Button type="button" variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="collaborator-name">Nombre del colaborador</Label>
              <Input id="collaborator-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Rosa Bustamante" minLength={2} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collaborator-phone">Número de celular</Label>
              <div className="flex">
                <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm">🇵🇪 +51</span>
                <Input id="collaborator-phone" className="rounded-l-none" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="900 461 720" inputMode="numeric" minLength={9} required />
              </div>
            </div>
            {!editing && <div className="space-y-2">
              <Label htmlFor="collaborator-password">Contraseña temporal</Label>
              <Input id="collaborator-password" type="text" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
              <p className="text-xs text-muted-foreground">Compártela de forma privada. El colaborador ingresará con su teléfono y esta contraseña.</p>
            </div>}
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>Cancelar</Button>
              <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {editing ? "Guardar cambios" : "Crear colaborador"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-bold tracking-wide text-foreground">PERSONAL ACTIVO</p>
              <span className="text-xs font-medium text-purple-600">{collaborators.length} {collaborators.length === 1 ? "asignado" : "asignados"}</span>
            </div>

            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-purple-600" /></div> : collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border/60">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">{initials(collaborator.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold">{collaborator.name}</p><Badge className={collaborator.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-600"}>{collaborator.is_active ? "Activo" : "Pausado"}</Badge></div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Volume2 className="h-3 w-3 text-emerald-500" /> Solo escucha alertas de cobro</p>
                  <p className="text-xs text-muted-foreground">{collaborator.phone_number}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Switch checked={collaborator.is_active} onCheckedChange={(active) => void setActive(collaborator, active)} aria-label={`Activar a ${collaborator.name}`} />
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(collaborator)}><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={saving} onClick={() => void remove(collaborator)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && collaborators.length === 0 && <div className="rounded-2xl border border-dashed border-purple-300 py-8 text-center"><Users className="mx-auto mb-2 h-8 w-8 text-purple-500" /><p className="font-medium">Sin colaboradores registrados</p><p className="text-sm text-muted-foreground">Crea la cuenta de tu primer cajero o socio.</p></div>}

            {!loading && collaborators.length < maxCollaborators && <button onClick={startCreate} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-purple-300 p-3 text-left transition-colors hover:bg-purple-50 dark:hover:bg-purple-950/30"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950"><UserPlus className="h-5 w-5" /></div><div className="flex-1"><p className="text-sm font-semibold">Cupo disponible</p><p className="text-xs text-muted-foreground">Agrega un nuevo cajero o socio</p></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white"><Plus className="h-5 w-5" /></span></button>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
