import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Scale, Users, Briefcase, BarChart, ShieldCheck, Calendar, Wallet, AreaChart, Award, FileText, GanttChartSquare, Landmark, Clock, Settings, User, LayoutDashboard, BadgeHelp, LogOut, BrainCircuit, Key, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/layout/logo";

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-primary" />,
    title: "Agenda Inteligente",
    description: "Prazos, audiências e atendimentos com visual de calendário e sincronização.",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Gestão de Processos",
    description: "Organize casos, documentos e atualizações em um ambiente colaborativo.",
  },
  {
    icon: <Wallet className="w-8 h-8 text-primary" />,
    title: "Financeiro e Reembolsos",
    description: "Controle total sobre despesas, lançamentos e solicitações com fluxo de aprovação.",
  },
  {
    icon: <AreaChart className="w-8 h-8 text-primary" />,
    title: "Controle de Despesas e Ganhos",
    description: "Visualize relatórios, histórico e dashboards dinâmicos com gráficos.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Plano e Assinaturas",
    description: "Gerencie o plano do escritório e histórico de pagamentos no painel Master.",
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Auditoria e Gamificação",
    description: "Monitore ações, conquistas e métricas de desempenho da sua equipe.",
  }
];

const plans = [
    {
        name: "Solo",
        price: "R$129",
        description: "Ideal para advogados autônomos.",
        features: ["1 advogado", "Gestão de Clientes e Processos", "Agenda e Prazos", "Suporte por Email"],
        cta: "Começar Agora"
    },
    {
        name: "Profissional",
        price: "R$399",
        description: "Para equipes em crescimento.",
        features: ["Até 5 usuários", "Tudo do Solo", "Módulo Financeiro", "Relatórios Básicos", "Suporte Prioritário"],
        cta: "Contratar Plano",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Customizado",
        description: "Soluções avançadas para grandes escritórios.",
        features: ["Usuários ilimitados", "Tudo do Profissional", "Módulos Avançados de IA", "Suporte Dedicado", "White Label opcional"],
        cta: "Entre em Contato"
    }
]

const testimonials = [
    {
        quote: "O Legatus Nexus revolucionou a forma como administramos o escritório. O controle de prazos e o módulo de reembolso nos pouparam horas por semana.",
        name: "Dra. Mariana Costa",
        firm: "Advogada Master — Lima & Costa Advocacia",
        image: PlaceHolderImages.find(p => p.id === 'testimonial1')
    },
    {
        quote: "A experiência é fluida e visualmente impecável. Finalmente um sistema que entende a rotina jurídica.",
        name: "Dr. Renato Albuquerque",
        firm: "Sócio — ABR Law Group",
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
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild><Link href="#about">Sobre</Link></Button>
            <Button variant="ghost" asChild><Link href="#modules">Módulos</Link></Button>
            <Button variant="ghost" asChild><Link href="#pricing">Planos</Link></Button>
          </nav>
          <nav className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/login">Acessar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Solicitar Demo</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-primary">
              Transforme a gestão do seu escritório em uma experiência inteligente e integrada.
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground">
              Controle prazos, audiências, finanças, clientes e equipe em um único sistema — com segurança, automação e ambientes personalizados para cada profissional.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  <Handshake />
                  Solicitar Demonstração
                </Link>
              </Button>
               <Button size="lg" variant="secondary" asChild>
                <Link href="/login">
                  <Key />
                  Acessar Plataforma
                </Link>
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

        {/* Sobre o Sistema Section */}
        <section id="about" className="py-20 bg-secondary/50 dark:bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">O futuro da advocacia é digital.</h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                O **Legatus Nexus** é uma plataforma completa de **gestão jurídica e administrativa**. Cada profissional tem seu próprio ambiente com permissões personalizadas, garantindo produtividade e controle.
              </p>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Multiusuário e Multi-escritório</p>
              </div>
               <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Painéis seguros e independentes</p>
              </div>
               <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Controle de prazos e audiências</p>
              </div>
               <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Gestão financeira integrada</p>
              </div>
               <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Relatórios em tempo real</p>
              </div>
               <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0"/>
                <p>Interface moderna e intuitiva</p>
              </div>
            </div>
          </div>
        </section>

        {/* Módulos Section */}
        <section id="modules" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Tudo o que seu escritório precisa para operar com excelência</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Recursos projetados para escritórios modernos.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="flex flex-col text-center p-6 rounded-lg transition-all hover:shadow-lg hover:-translate-y-1 border-transparent hover:border-primary/20 bg-secondary/30 dark:bg-card">
                            <div className="flex-shrink-0">{feature.icon}</div>
                            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-secondary/50 dark:bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Planos sob medida para cada porte de escritório</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Escolha a solução ideal para o seu crescimento.</p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3 items-end">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col rounded-xl transition-all ${plan.popular ? 'border-primary border-2 shadow-2xl -translate-y-4' : 'shadow-lg hover:shadow-xl'}`}>
                            {plan.popular && <div className="text-center py-2 bg-primary text-primary-foreground font-semibold rounded-t-lg text-sm">Mais Popular</div>}
                            <CardHeader className="items-center text-center">
                                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                                <p className="text-muted-foreground text-sm">{plan.description}</p>
                                {plan.price.startsWith("R$") ? (
                                    <p className="text-4xl font-bold pt-4">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                                ) : (
                                     <p className="text-4xl font-bold pt-4">{plan.price}</p>
                                )}
                            </CardHeader>
                            <CardContent className="flex flex-col flex-grow p-6 pt-0">
                                <ul className="space-y-3 flex-grow mb-6">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-auto" variant={plan.popular ? 'default' : 'outline'}>{plan.cta}</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                   <p className="text-muted-foreground">Precisa de uma solução totalmente personalizada? <Button variant="link" className="p-0 h-auto" asChild><Link href="/contact">Entre em contato</Link></Button></p>
                </div>
            </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">O que nossos clientes dizem</h2>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6 bg-secondary/30 dark:bg-card">
                            <CardContent className="p-0">
                                <p className="italic text-lg">"{testimonial.quote}"</p>
                                <div className="mt-4 flex items-center gap-4">
                                  {testimonial.image && (
                                     <Image src={testimonial.image.imageUrl} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover" data-ai-hint={testimonial.image.imageHint} />
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
        <div className="container mx-auto py-8 px-4 md:px-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <Logo />
                </div>
                <p className="text-sm text-primary-foreground/80">&copy; {new Date().getFullYear()} Legatus Nexus — Solução Jurídica Integrada</p>
            </div>
            <div className="mt-6 text-center text-xs text-primary-foreground/60 space-y-1">
                <p>Desenvolvido por **Nexus Studio SP**</p>
                <p>Rua Contos Guachescos, 165 — Vila Santa Catarina — São Paulo/SP</p>
                <p>
                    <a href="mailto:contato@nexusstudiosp.com.br" className="hover:underline">contato@nexusstudiosp.com.br</a>
                    <span className="mx-2">|</span>
                    <a href="http://www.nexusstudiosp.com.br" target="_blank" rel="noopener noreferrer" className="hover:underline">www.nexusstudiosp.com.br</a>
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}

    