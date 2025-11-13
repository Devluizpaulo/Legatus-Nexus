"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

export default function AvaliarTab() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const { toast } = useToast();

    const handleSubmit = () => {
        if (rating === 0) {
            toast({
                variant: 'destructive',
                title: "Avaliação incompleta",
                description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
            });
            return;
        }

        console.log({ rating, comment });
        toast({
            title: "Avaliação enviada!",
            description: "Obrigado pelo seu feedback. Ele nos ajuda a melhorar!",
        });
        setRating(0);
        setComment("");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Avaliar o Sistema</CardTitle>
                <CardDescription>
                    Seu feedback é muito importante para nós. Conte-nos o que achou da plataforma.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="text-sm font-medium">Sua nota</label>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    key={ratingValue}
                                    type="button"
                                    onClick={() => setRating(ratingValue)}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "h-7 w-7 cursor-pointer transition-colors",
                                            ratingValue <= (hover || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <Textarea
                    placeholder="Deixe um comentário (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px]"
                />

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={rating === 0}>
                        Enviar Avaliação
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
