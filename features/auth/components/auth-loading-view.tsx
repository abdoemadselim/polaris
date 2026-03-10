import { Spinner } from "@/components/ui/spinner"

export default function AuthLoadingView() {
    return (
        <main className="flex flex-col flex-1 justify-center items-center">
            <Spinner className="size-8" />
        </main>
    )
}
