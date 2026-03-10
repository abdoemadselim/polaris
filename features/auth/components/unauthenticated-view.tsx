// Libs
import { SignInButton } from "@clerk/nextjs"
import { Shield } from "lucide-react"

// Components
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

export default function UnauthenticatedView() {
    return (
        <main className="flex flex-col flex-1 justify-center items-center w-full">
            <h1 className="mb-8 text-4xl bg-amber-400/80 rounded-xl text-muted font-bold px-4">
                Polaris
            </h1>
            <Item className="w-full max-w-2xl bg-muted" variant="outline">
                <ItemMedia variant="icon">
                    <Shield />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>Unauthorized access</ItemTitle>
                    <ItemDescription>You{"'"}re not authorized to access this resource </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <SignInButton>
                        <Button variant="outline">Sign in</Button>
                    </SignInButton>
                </ItemActions>
            </Item>
        </main>
    )
}
