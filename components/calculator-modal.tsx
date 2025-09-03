"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, MessageCircle } from "lucide-react"

interface CalculatorModalProps {
  productType: string
}

export function CalculatorModal({ productType }: CalculatorModalProps) {
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")
  const [total, setTotal] = useState(0)
  const [area, setArea] = useState(0)

  const productPrices: { [key: string]: { [variant: string]: number } } = {
    Lona: {
      "Lona UV": 85,
      "Lona Normal": 70,
    },
    Banner: {
      "Banner Personalizado (sem verniz UV, 380g, lona brilho, solvente)": 102.5,
      "Banner Personalizado (440g, lona fosca, UV)": 120,
    },
    Adesivo: {
      "Adesivo Normal": 70,
      "Adesivo Normal UV": 90,
      "Adesivo Perfurado": 90,
    },
  }

  const calculatePrice = () => {
    const w = Number.parseFloat(width)
    const h = Number.parseFloat(height)

    if (w > 0 && h > 0 && selectedVariant) {
      const calculatedArea = w * h
      const pricePerM2 = productPrices[productType]?.[selectedVariant] || 0
      const calculatedTotal = calculatedArea * pricePerM2

      setArea(calculatedArea)
      setTotal(calculatedTotal)
    } else {
      setArea(0)
      setTotal(0)
    }
  }

  const openWhatsApp = () => {
    const message = `Olá! Gostaria de um orçamento para:
${selectedVariant}
Dimensões: ${width}m x ${height}m (${area.toFixed(2)}m²)
Valor calculado: R$ ${total.toFixed(2)}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-cyan-400 text-cyan-600 hover:bg-cyan-50 bg-transparent">
          <Calculator className="w-4 h-4 mr-1" />
          Calcular
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-600" />
            Calculadora de {productType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Variant Selection */}
          <div className="space-y-2">
            <Label htmlFor="variant">Tipo de {productType}</Label>
            <Select value={selectedVariant} onValueChange={setSelectedVariant}>
              <SelectTrigger>
                <SelectValue placeholder={`Selecione o tipo de ${productType.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(productPrices[productType] || {}).map(([variant, price]) => (
                  <SelectItem key={variant} value={variant}>
                    {variant} - R$ {price}/m²
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Largura (metros)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex: 2.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Altura (metros)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex: 1.5"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculatePrice}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
            disabled={!width || !height || !selectedVariant}
          >
            Calcular Preço
          </Button>

          {/* Results */}
          {area > 0 && total > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Área total:</span>
                <span className="font-semibold">{area.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Preço por m²:</span>
                <span className="font-semibold">
                  R$ {(productPrices[productType]?.[selectedVariant] || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-lg">Total:</span>
                <span className="font-bold text-lg text-green-600">R$ {total.toFixed(2)}</span>
              </div>

              <Button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-700 mt-3">
                <MessageCircle className="w-4 h-4 mr-2" />
                Solicitar Orçamento via WhatsApp
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
