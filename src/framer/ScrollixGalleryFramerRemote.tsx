import * as React from "react"

const RUNTIME = "https://capable-youtiao-4bc2f1.netlify.app/element.js?v=21"
const BASE = "https://capable-youtiao-4bc2f1.netlify.app"
const TAGS = ["scrollix-gallery-v2", "scrollix-gallery"]

const project = {
    theme: {
        quality: "auto",
        atmosphere: "calm",
        materials: {
            primary: "stone",
            accent: "metal",
            textureTiling: {
                wall: 1,
                floor: 1,
                ceiling: 1,
                wallDeformation: "stretched",
                floorDeformation: "stretched",
                ceilingDeformation: "stretched",
            },
        },
        lighting: { ceilingLightIntensity: 1, ceilingLightRadius: 0.095 },
        items: { showBorders: true },
    },
    layout: {
        type: "infinite-corridor",
        spacing: 14,
        bounds: { width: 8, height: 4.2, depth: 360 },
    },
    journey: {
        mode: "scroll",
        artworkOverlayFramingMode: "balanced",
        loop: true,
        smoothing: 0.16,
        damping: 0.84,
        scrollStrength: 1,
        camera: {
            height: 1.72,
            fov: 50,
            lookAhead: 3.2,
            desktopFramingDistance: 1.18,
            mobileFramingDistance: 1,
            mobileStationFramingDistance: 1.55,
        },
    },
    items: [
        {
            id: "intro",
            type: "statement",
            placement: { side: "center" },
            appearance: { size: "large", lighting: "featured" },
            content: {
                eyebrow: "Scrollix",
                title: "Runtime Loaded",
                description: "Framer bridge works.",
            },
        },
    ],
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForAnyTag() {
    const existingTag = TAGS.find((name) => customElements.get(name))
    if (existingTag) return existingTag

    try {
        window.ScrollixGalleryRuntime?.init?.("scrollix-gallery")
        window.ScrollixGalleryRuntime?.registerWebComponents?.("scrollix-gallery")
    } catch (error) {
        const recoveredTag = TAGS.find((name) => customElements.get(name))
        if (recoveredTag) return recoveredTag
        throw error
    }

    for (let i = 0; i < 80; i++) {
        const tag = TAGS.find((name) => customElements.get(name))
        if (tag) return tag
        await wait(100)
    }

    throw new Error(
        `Runtime loaded but no custom element registered. Has API: ${Boolean(window.ScrollixGalleryRuntime)}`
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1280
 * @framerIntrinsicHeight 760
 */
export default function ScrollixBridge(props: any) {
    const host = React.useRef<HTMLDivElement | null>(null)
    const [state, setState] = React.useState("loading")
    const [tag, setTag] = React.useState<string | null>(null)

    React.useEffect(() => {
        const script = document.createElement("script")
        script.type = "module"
        script.src = RUNTIME
        script.onload = async () => {
            try {
                const registeredTag = await waitForAnyTag()
                setTag(registeredTag)
                setState("ready")
            } catch (error) {
                setState(error instanceof Error ? error.message : "runtime registration error")
            }
        }
        script.onerror = () => setState("script error")
        document.head.appendChild(script)
    }, [])

    React.useEffect(() => {
        if (state !== "ready" || !tag || !host.current) return

        const el = document.createElement(tag)
        el.setAttribute("project", JSON.stringify(project))
        el.setAttribute("asset-base-url", BASE)
        el.style.display = "block"
        el.style.width = "100%"
        el.style.height = "100%"
        host.current.replaceChildren(el)
    }, [state, tag])

    if (state !== "ready") {
        return (
            <div style={{
                ...props.style,
                width: "100%",
                height: "100%",
                minHeight: 300,
                display: "grid",
                placeItems: "center",
                background: "#171716",
                color: "white",
                font: "800 16px system-ui",
                padding: 24,
                textAlign: "center",
            }}>
                Scrollix: {state}
            </div>
        )
    }

    return (
        <div
            ref={host}
            style={{
                ...props.style,
                width: "100%",
                height: "100%",
                minHeight: 760,
                background: "#171716",
            }}
        />
    )
}

declare global {
    interface Window {
        ScrollixGalleryRuntime?: {
            init(tagName?: string): void
            registerWebComponents(tagName?: string): void
        }
    }
}
