'use client'

import { Button } from "@/components/ui/button"

export default function page() {
    const handleBlocking = async () => {
        await fetch("/api/demo/blocking", { method: "POST" })
    }

    return (
        <Button onClick={handleBlocking}> Blocking</Button>
    )
}
