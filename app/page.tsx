"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Search, Filter, Quote, Star, Package, Printer, FileText, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { CalculatorModal } from "@/components/calculator-modal"

interface ProductVariant {
  id: string
  quantity: string
  price: string
}

interface Product {
  name: string
  category: string
  variants: ProductVariant[]
  image: string
  hasCalculator?: boolean
  calculatorType?: string
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const getProductImage = (productName: string): string => {
    const name = productName.toLowerCase()

    if (name.includes("panfleto 80g frente e verso")) {
      return "/images/panfleto-80g-frente-verso.png"
    }
    if (name.includes("panfleto 80g frente")) {
      return "/images/panfleto-80g-frente.png"
    }
    if (name.includes("panfleto 115g frente e verso")) {
      return "/images/panfleto-115g-frente-verso.png"
    }
    if (name.includes("panfleto 115g frente")) {
      return "/images/panfleto-115g-frente.png"
    }
    if (name.includes("cartão de visita frente e verso")) {
      return "/images/cartao-visita-frente-verso.png"
    }
    if (name.includes("cartão de visita frente")) {
      return "/images/cartao-visita-frente.png"
    }
    if (name.includes("camisa branca poliester xgg")) {
      return "/images/camisa-branca-xgg.webp"
    }
    if (name.includes("camisa branca poliester p ao gg")) {
      return "/images/camisa-branca-p-gg.webp"
    }
    if (name.includes("camisa colorida poliester")) {
      return "/images/camisa-branca-p-gg.webp"
    }
    if (name.includes("lona uv")) {
      return "/images/lona-uv.png"
    }
    if (name.includes("lona normal")) {
      return "/images/lona-normal.png"
    }

    return "/images/product-example.png"
  }

  const fetchProducts = async () => {
    try {
      // Dados específicos fornecidos pelo usuário + novos produtos com calculadora
      const productData = [
        { id: "1", name: "Panfleto 80g frente", quantity: "2500", price: "R$ 150,00" },
        { id: "2", name: "Panfleto 80g frente", quantity: "5000", price: "R$ 220,00" },
        { id: "3", name: "Panfleto 80g frente", quantity: "10000", price: "R$ 400,00" },
        { id: "4", name: "Panfleto 80g frente e verso", quantity: "2500", price: "R$ 240,00" },
        { id: "5", name: "Panfleto 80g frente e verso", quantity: "5000", price: "R$ 300,00" },
        { id: "6", name: "Panfleto 80g frente e verso", quantity: "10000", price: "R$ 500,00" },
        { id: "7", name: "Panfleto 115g frente", quantity: "1000", price: "R$ 160,00" },
        { id: "8", name: "Panfleto 115g frente", quantity: "2500", price: "R$ 245,00" },
        { id: "9", name: "Panfleto 115g frente", quantity: "5000", price: "R$ 410,00" },
        { id: "10", name: "Panfleto 115g frente", quantity: "10000", price: "R$ 540,00" },
        { id: "11", name: "Panfleto 115g frente e verso", quantity: "1000", price: "R$ 210,00" },
        { id: "12", name: "Panfleto 115g frente e verso", quantity: "2500", price: "R$ 300,00" },
        { id: "13", name: "Panfleto 115g frente e verso", quantity: "5000", price: "R$ 380,00" },
        { id: "14", name: "Panfleto 115g frente e verso", quantity: "10000", price: "R$ 720,00" },
        { id: "15", name: "Cartão de visita frente", quantity: "1000", price: "R$ 70,00" },
        { id: "16", name: "Cartão de visita frente e verso", quantity: "1000", price: "R$ 90,00" },
        { id: "17", name: "Camisa branca poliester P ao GG", quantity: "1", price: "R$ 35,00" },
        { id: "18", name: "Camisa branca poliester XGG", quantity: "1", price: "R$ 45,00" },
        { id: "19", name: "Camisa Colorida Poliester P ao GG", quantity: "1", price: "R$ 40,00" },
        { id: "20", name: "Camisa Colorida Poliester XGG", quantity: "1", price: "R$ 50,00" },
        { id: "21", name: "Lona UV", quantity: "1", price: "R$ 85,00" },
        { id: "22", name: "Lona Normal", quantity: "1", price: "R$ 70,00" },
        // Novos produtos com calculadora
        { id: "23", name: "Lona Personalizada", quantity: "m²", price: "A partir de R$ 70,00" },
        { id: "24", name: "Banner Personalizado", quantity: "m²", price: "A partir de R$ 102,50" },
        { id: "25", name: "Adesivo Personalizado", quantity: "m²", price: "A partir de R$ 70,00" },
      ]

      // Agrupar produtos por nome
      const groupedProducts: { [key: string]: Product } = {}

      productData.forEach((item) => {
        if (!groupedProducts[item.name]) {
          const hasCalculator = item.name.includes("Personalizada") || item.name.includes("Personalizado")
          let calculatorType = ""

          if (item.name.includes("Lona")) calculatorType = "Lona"
          else if (item.name.includes("Banner")) calculatorType = "Banner"
          else if (item.name.includes("Adesivo")) calculatorType = "Adesivo"

          groupedProducts[item.name] = {
            name: item.name,
            category: item.name.includes("Panfleto")
              ? "Panfletos"
              : item.name.includes("Cartão")
                ? "Cartões"
                : item.name.includes("Camisa")
                  ? "Camisas"
                  : item.name.includes("Lona") || item.name.includes("Banner")
                    ? "Lonas e Banners"
                    : item.name.includes("Adesivo")
                      ? "Adesivos"
                      : "Outros",
            variants: [],
            image: getProductImage(item.name),
            hasCalculator,
            calculatorType,
          }
        }

        groupedProducts[item.name].variants.push({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })
      })

      setProducts(Object.values(groupedProducts))
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    }

    setFilteredProducts(filtered)
  }

  const getProductIcon = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes("panfleto") || cat.includes("flyer")) return <FileText className="w-5 h-5" />
    if (cat.includes("cartão") || cat.includes("card")) return <Package className="w-5 h-5" />
    if (cat.includes("banner") || cat.includes("lona")) return <Printer className="w-5 h-5" />
    return <Package className="w-5 h-5" />
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const openWhatsApp = (productName: string) => {
    const message = `Olá! Gostaria de saber mais sobre: ${productName}`
    const whatsappUrl = `https://wa.me/5522997179616?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b-4 border-gradient-to-r from-cyan-400 via-yellow-400 to-pink-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/logo-symbol.png"
                alt="RR Gráfica Expresso"
                width={50}
                height={50}
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">RR Gráfica Expresso</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Catálogo de Produtos</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                <Star className="w-4 h-4 mr-1" />
                Qualidade Premium
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="ml-2"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <section className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-2 border-gray-200">
                  <SelectValue placeholder="Filtrar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.name}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-400 overflow-hidden bg-white dark:bg-gray-800"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-cyan-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{product.category} • Qualidade Premium</p>
                  {product.hasCalculator && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 w-fit">
                      Calculadora disponível
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Product Image */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="relative h-24 w-24 ml-auto rounded-lg overflow-hidden transition-all duration-300">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">Descrição</h4>

                    <div className="space-y-2">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{variant.quantity}(und)</span>
                          <span className="font-bold text-red-600 text-sm">{variant.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={() => openWhatsApp(product.name)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp
                    </Button>
                    {product.hasCalculator ? (
                      <CalculatorModal productType={product.calculatorType || ""} />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cyan-400 text-cyan-600 hover:bg-cyan-50 bg-transparent"
                      >
                        <Quote className="w-4 h-4 mr-1" />
                        Orçar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">Tente ajustar os filtros ou termo de busca</p>
          </div>
        )}
      </main>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => openWhatsApp("Catálogo Geral")}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/images/logo-full.png"
                alt="RR Gráfica Expresso"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-300">© 2024 RR Gráfica Expresso. Todos os direitos reservados.</p>
              <p className="text-xs text-gray-400 mt-1">Qualidade e agilidade em impressão</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
