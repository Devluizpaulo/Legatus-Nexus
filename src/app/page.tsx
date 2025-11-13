import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Scale, Users, Briefcase, BarChart, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/layout/logo";

const features = [
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Gestão de Processos Kanban",
    description: "Visualize o andamento dos seus casos com um quadro Kanban intuitivo. Mova processos entre fases com facilidade.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Faturamento e Time Tracking",
    description: "Gere faturas automaticamente a partir de horas trabalhadas. Monitore o tempo gasto em cada cliente e processo.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Controle de Acesso por Cargo",
    description: "Defina permissões específicas para cada membro da equipe, garantindo a segurança e a organização dos dados.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Dashboard Personalizado",
    description: "Cada usuário tem uma visão geral com os KPIs mais relevantes para sua função, otimizando a tomada de decisões.",
  },
];

const plans = [
    {
        name: "Essencial",
        price: "R$199",
        features: ["Até 5 usuários", "Gestão de Clientes e Processos", "Agenda e Prazos", "Suporte por Email"],
        cta: "Começar Agora"
    },
    {
        name: "Profissional",
        price: "R$399",
        features: ["Usuários ilimitados", "Tudo do Essencial", "Módulo Financeiro Completo", "Relatórios Avançados", "Integração com IA", "Suporte Prioritário"],
        cta: "Contratar Plano",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Customizado",
        features: ["Tudo do Profissional", "Tenant Dedicado", "Gestor de Conta", "SLA Personalizado"],
        cta: "Entre em Contato"
    }
]

const testimonials = [
    {
        quote: "O Legatus Nexus transformou a gestão do nosso escritório. A automação do faturamento nos poupou horas de trabalho administrativo.",
        name: "Dr. João Silva",
        firm: "Silva & Associados",
        image: PlaceHolderImages.find(p => p.id === 'testimonial1')
    },
    {
        quote: "A visão Kanban dos processos é fantástica. Finalmente temos clareza sobre o andamento de cada caso.",
        name: "Dra. Maria Oliveira",
        firm: "Oliveira Advocacia",
        image: PlaceHolderImages.find(p => p.id === 'testimonial2')
    }
]

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Começar Agora</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-primary">
              A gestão completa para o seu escritório de advocacia.
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground">
              Do controle de processos ao faturamento automatizado. O Legatus Nexus é a plataforma SaaS que centraliza e otimiza a sua operação.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Teste Grátis por 14 dias</Link>
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-5">
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                />
            </div>
          )}
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-secondary/50 dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Inteligência e Eficiência para sua Advocacia</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Recursos projetados para escritórios modernos.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            {feature.icon}
                            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Planos que se adaptam ao seu crescimento</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Escolha a solução ideal para o seu escritório.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3 items-center">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary border-2 shadow-lg -translate-y-4' : ''}`}>
                            {plan.popular && <div className="text-center py-1 bg-primary text-primary-foreground font-semibold rounded-t-lg">Mais Popular</div>}
                            <CardHeader className="text-center">
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <p className="text-4xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow">
                                <ul className="space-y-3 flex-grow">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'}>{plan.cta}</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-secondary/50 dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">O que nossos clientes dizem</h2>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6">
                            <CardContent className="p-0">
                                <p className="italic">"{testimonial.quote}"</p>
                                <div className="mt-4 flex items-center gap-4">
                                  {testimonial.image && (
                                     <Image src={testimonial.image.imageUrl} alt={testimonial.name} width={48} height={48} className="rounded-full" data-ai-hint={testimonial.image.imageHint} />
                                  )}
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.firm}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale />
            <span className="font-headline text-xl font-bold">Legatus Nexus</span>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-4 md:mt-0">&copy; {new Date().getFullYear()} Legatus Nexus. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
