'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { TranslatedText } from '@/components/shared/translated-text'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface InquiryFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
  privacy: boolean
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  message?: string
  privacy?: string
}

interface InquiryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOfficeId: string
  apartmentTitle: string
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function stripPhone(value: string): string {
  return value.replace(/[\s\-\(\)]/g, '')
}

function isValidPhone(value: string): boolean {
  return /^\+?\d{10,15}$/.test(stripPhone(value))
}

export function InquiryModal({
  open,
  onOpenChange,
  onOfficeId,
  apartmentTitle,
}: InquiryModalProps) {
  const { data: session } = useSession()
  const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken
  const [form, setForm] = useState<InquiryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
    privacy: false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  function validate(): boolean {
    const errs: FieldErrors = {}

    if (!form.firstName.trim()) errs.firstName = 'Bitte geben Sie Ihren Vornamen ein.'
    if (!form.lastName.trim()) errs.lastName = 'Bitte geben Sie Ihren Nachnamen ein.'
    if (!form.email.trim()) errs.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
    else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    if (!form.phoneNumber.trim()) errs.phoneNumber = 'Bitte geben Sie Ihre Telefonnummer ein.'
    else if (!isValidPhone(form.phoneNumber))
      errs.phoneNumber = 'Bitte geben Sie 10–15 Ziffern ein.'
    if (!form.message.trim()) errs.message = 'Bitte schreiben Sie eine Nachricht.'
    if (!form.privacy) errs.privacy = 'Bitte stimmen Sie der Datenschutzerklärung zu.'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    setApiError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // POST /api/inquiry — replace endpoint if different
      const res = await fetch(`${API_BASE_URL}/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          onOfficeId,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phoneNumber: stripPhone(form.phoneNumber),
          message: form.message.trim(),
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(
          errBody?.message || 'Failed to submit inquiry. Please try again.',
        )
      }

      setSuccess(true)
      toast.success('Inquiry submitted successfully!')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
        privacy: false,
      })
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      setApiError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  function update(field: keyof InquiryFormData, value: string | boolean) {
    // phone: only digits, +, space, dash, parens
    if (field === 'phoneNumber') {
      value = String(value).replace(/[^\d\s\+\-\(\)]/g, '')
    }
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-[#1672E6] mb-1">
          Wohnungsanfrage senden
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Interesse an{' '}
          <span className="font-medium text-slate-700">{apartmentTitle}</span>
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-700">
              <TranslatedText
                text="Inquiry submitted successfully!"
                cacheKey="inquiry:success"
              />
            </p>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Vorname
                </label>
                <input
                  value={form.firstName}
                  onChange={e => update('firstName', e.target.value)}
                  placeholder="Ihr Vorname"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1672E6] focus:ring-1 focus:ring-[#1672E6]/20 ${errors.firstName ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.firstName && (
                  <p className="mt-0.5 text-xs text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nachname
                </label>
                <input
                  value={form.lastName}
                  onChange={e => update('lastName', e.target.value)}
                  placeholder="Ihr Nachname"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1672E6] focus:ring-1 focus:ring-[#1672E6]/20 ${errors.lastName ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.lastName && (
                  <p className="mt-0.5 text-xs text-red-500">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="name@beispiel.de"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1672E6] focus:ring-1 focus:ring-[#1672E6]/20 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefonnummer
              </label>
              <input
                value={form.phoneNumber}
                onChange={e => update('phoneNumber', e.target.value)}
                placeholder="+49 171 1234567"
                inputMode="numeric"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1672E6] focus:ring-1 focus:ring-[#1672E6]/20 ${errors.phoneNumber ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.phoneNumber && (
                <p className="mt-0.5 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nachricht
              </label>
              <textarea
                value={form.message}
                onChange={e => update('message', e.target.value)}
                placeholder="Ich interessiere mich für diese Wohnung. Bitte senden Sie mir weitere Informationen."
                rows={4}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#1672E6] focus:ring-1 focus:ring-[#1672E6]/20 resize-none ${errors.message ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.message && (
                <p className="mt-0.5 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            <div><label className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={form.privacy} onChange={e=>update('privacy',e.target.checked)} className="mt-1 h-4 w-4 accent-[#6f7470]"/><span>Ich habe die <Link href="/privacy" className="underline">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben zu.</span></label>{errors.privacy&&<p className="mt-1 text-xs text-red-500">{errors.privacy}</p>}</div>

            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {apiError}
              </p>
            )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#6f7470] hover:bg-[#5e625f] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>Wird gesendet …</>
                ) : (
                  <>Anfrage senden</>
                )}
              </button>
          </form>
        )}
      </div>
    </div>
  )
}
