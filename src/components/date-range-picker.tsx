'use client';

import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";

export function DateRangePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);


    const updateDateRange = (range: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams);

        if (range?.from) {
            params.set('from', range.from.toISOString());
        } else {
            params.delete('from');
        }

        if (range?.to) {
            params.set('to', range.to.toISOString());
            setOpen(false); // Close popover when both dates selected

        } else {
            params.delete('to');
        }

        router.push(`?${params.toString()}`);
    };

    const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined;
    const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined;
    const date: DateRange = { from, to };

    return (
        <div className="flex gap-2">

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={updateDateRange}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
            {(date?.from || date?.to) && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateDateRange(undefined)}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>

    );
}