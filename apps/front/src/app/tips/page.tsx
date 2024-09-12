"use client";

import api from "@/api";
import { Subtitle } from "@/components/text/subtitle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Tip } from "@seminar/common";
import { useEffect, useState } from "react";

export default function TipsPage() {
    const [tips, setTips] = useState<Tip[]>([]);

    const [selected, setSelected] = useState<number>(-1);

    const getTips = async () => {
        const tips = await api.tips.list();

        if (!tips || !tips.ok) return;

        setTips(tips.data.tips);
    };

    const deleteTip = async (id: number) => {
        const res = await api.tips._delete(id);

        if (!res || !res.ok) return;

        setTips([...tips.filter((tip) => tip.id !== id)]);
    }

    useEffect(() => {
        getTips();
    }, []);

    return (
        <main>
            <Subtitle text="Tips Coaches" />

            <div className="flex flex-col gap-1 mt-2">
                {tips.map((tip) => (
                    <div className="w-full border rounded-sm" key={tip.id}>
                        <div
                            className="p-4 flex items-center"
                            onClick={() =>
                                setSelected(selected === tip.id ? -1 : tip.id)
                            }
                        >
                            <h3 className="text-md">{tip.title}</h3>
                            <div className="ml-auto">
                                {selected !== tip.id ? (
                                    <ChevronDownIcon className="size-5 text-primary" />
                                ) : (
                                    <ChevronDownIcon className="size-5 text-primary transform rotate-180" />
                                )}
                            </div>
                        </div>
                        {selected === tip.id && (
                            <div>
                                <Separator />
                                <div className="p-4 flex items-center">
                                    <p className="text-sm">{tip.content}</p>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="ml-auto"
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete the
                                                    selected tips.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        deleteTip(tip.id)
                                                    }
                                                >
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
