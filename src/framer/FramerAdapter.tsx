import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const RUNTIME = "https://capable-youtiao-4bc2f1.netlify.app/element.js?v=21"
const BASE = "https://capable-youtiao-4bc2f1.netlify.app"
const TAGS = ["scrollix-gallery-v2", "scrollix-gallery"]

type ItemType = "statement" | "artwork" | "quote" | "profile" | "image" | "cta"
type Placement = "station" | "wall-left" | "wall-right" | "wall-auto"
type Size = "small" | "medium" | "large"
type Lighting = "none" | "subtle" | "featured"
type TexturePreset = "stone" | "brick" | "wood" | "tiles" | "woodTiles" | "darkSand" | "sand" | "rocks"

interface FramerItem {
    id?: string
    type: ItemType
    placement: Placement
    eyebrow?: string
    title: string
    subtitle?: string
    description?: string
    body?: string
    image?: string
    imageAlt?: string
    size?: Size
    lighting?: Lighting
    ctaLabel?: string
    ctaUrl?: string
}

interface Props {
    style?: React.CSSProperties
    quality: "auto" | "low" | "medium" | "high" | "ultra"
    texture: TexturePreset
    showBorders: boolean
    loop: boolean
    spacing: number
    corridorWidth: number
    corridorHeight: number
    contentSource: "controls" | "json"
    projectJson?: string
    items: FramerItem[]
}

const DEFAULT_ITEMS: FramerItem[] = [
    {
        id: "intro",
        type: "statement",
        placement: "station",
        eyebrow: "Scrollix Gallery 3D",
        title: "Immersive portfolio",
        description: "A cinematic 3D showcase built in Framer.",
        size: "large",
        lighting: "featured",
    },
    {
        id: "showcase-projects",
        type: "artwork",
        placement: "wall-left",
        eyebrow: "01 / Visual showcase",
        title: "Present your strongest work",
        description: "Add project images, campaign visuals, photography or product renders. Each item becomes part of the architecture and receives its own focal moment during the journey.",
        image: "https://picsum.photos/id/1015/1400/1000",
        imageAlt: "Mountain landscape used as a portfolio placeholder",
        size: "medium",
        lighting: "featured",
    },
    {
        id: "json-driven",
        type: "quote",
        placement: "wall-right",
        eyebrow: "02 / Flexible content",
        title: "One item system. Many types of stories.",
        description: "Combine artworks, images, statements, profiles, quotes and calls to action without rebuilding the scene. The same content model powers the entire experience.",
        size: "medium",
        lighting: "subtle",
    },
    {
        id: "mobile-experience",
        type: "statement",
        placement: "station",
        eyebrow: "03 / Mobile first",
        title: "Built for mobile",
        description: "Fluid 3D navigation with a native-style bottom sheet.",
        size: "large",
        lighting: "featured",
    },
    {
        id: "real-images",
        type: "artwork",
        placement: "wall-right",
        eyebrow: "04 / Your content",
        title: "Replace placeholders with your own images",
        description: "Upload your images from the Framer controls. Use the gallery as a portfolio, product presentation, exhibition or visual storytelling page.",
        image: "https://picsum.photos/id/1039/1400/1000",
        imageAlt: "Architectural placeholder image",
        size: "medium",
        lighting: "featured",
    },
    {
        id: "creator-profile",
        type: "profile",
        placement: "wall-left",
        eyebrow: "05 / About you",
        title: "Introduce the person behind the work",
        description: "Use profile items for your biography, studio introduction or creative approach. Mix personal context with visual projects inside the same journey.",
        image: "https://picsum.photos/id/1005/1000/1200",
        imageAlt: "Portrait placeholder for the creator profile",
        size: "medium",
        lighting: "subtle",
    },
    {
        id: "texture-system",
        type: "image",
        placement: "wall-right",
        eyebrow: "06 / Atmosphere",
        title: "Choose the architectural texture",
        description: "Switch between stone, brick, wood, tiles, sand and rock presets. The same content can instantly take on a different visual identity.",
        image: "https://picsum.photos/id/1067/1400/1000",
        imageAlt: "Textured architecture placeholder image",
        size: "medium",
        lighting: "featured",
    },
    {
        id: "immersive-lighting",
        type: "image",
        placement: "wall-left",
        eyebrow: "07 / Immersive lighting",
        title: "Realistic atmosphere without heavy rendering",
        description: "Architectural LED effects, focal lighting and optimized materials create depth and immersion while keeping the runtime lightweight.",
        image: "https://picsum.photos/id/1048/1400/1000",
        imageAlt: "Atmospheric landscape placeholder image",
        size: "medium",
        lighting: "featured",
    },
    {
        id: "final-cta",
        type: "cta",
        placement: "station",
        eyebrow: "08 / Your portfolio",
        title: "Create your gallery",
        description: "Replace the content and publish your immersive portfolio.",
        size: "large",
        lighting: "featured",
        ctaLabel: "Start your project",
        ctaUrl: "https://example.com",
    },
]

const DEFAULTS: Props = {
    quality: "auto",
    texture: "stone",
    showBorders: true,
    loop: true,
    spacing: 14,
    corridorWidth: 8,
    corridorHeight: 4.2,
    contentSource: "controls",
    projectJson: "",
    items: DEFAULT_ITEMS,
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

function slug(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

function placementToSide(placement: Placement): "left" | "right" | "center" | "auto" {
    if (placement === "station") return "center"
    if (placement === "wall-left") return "left"
    if (placement === "wall-right") return "right"
    return "auto"
}

function inferFormat(src: string): "jpg" | "png" | "webp" | "ktx2" | undefined {
    const extension = src.split("?")[0]?.split(".").pop()?.toLowerCase()
    if (extension === "jpg" || extension === "jpeg") return "jpg"
    if (extension === "png" || extension === "webp" || extension === "ktx2") return extension
    return undefined
}

function buildItems(items: FramerItem[]) {
    const usedIds = new Set<string>()

    return items.map((item, index) => {
        const base = slug(item.id || item.title || `${item.type}-${index + 1}`) || `${item.type}-${index + 1}`
        let id = base
        let suffix = 2

        while (usedIds.has(id)) {
            id = `${base}-${suffix}`
            suffix += 1
        }

        usedIds.add(id)

        const image = typeof item.image === "string" && item.image.trim() ? item.image.trim() : undefined

        return {
            id,
            type: item.type,
            placement: {
                side: placementToSide(item.placement),
            },
            appearance: {
                size: item.size,
                lighting: item.lighting,
                media: image
                    ? [{
                        src: image,
                        type: "image",
                        format: inferFormat(image),
                        quality: "high",
                        alt: item.imageAlt || item.title,
                    }]
                    : undefined,
            },
            content: {
                eyebrow: item.eyebrow,
                title: item.title,
                subtitle: item.subtitle,
                description: item.description,
                body: item.body,
                cta: item.ctaLabel && item.ctaUrl
                    ? { label: item.ctaLabel, href: item.ctaUrl }
                    : undefined,
            },
        }
    })
}

function buildProject(props: Props) {
    if (props.contentSource === "json" && props.projectJson?.trim()) {
        return JSON.parse(props.projectJson)
    }

    return {
        theme: {
            quality: props.quality,
            atmosphere: "calm",
            materials: {
                primary: props.texture,
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
            items: { showBorders: props.showBorders },
        },
        layout: {
            type: "infinite-corridor",
            spacing: props.spacing,
            bounds: { width: props.corridorWidth, height: props.corridorHeight, depth: 360 },
        },
        journey: {
            mode: "scroll",
            artworkOverlayFramingMode: "balanced",
            loop: props.loop,
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
        items: buildItems(props.items || []),
    }
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1280
 * @framerIntrinsicHeight 760
 */
export default function ScrollixBridge(rawProps: Partial<Props>) {
    const props = { ...DEFAULTS, ...rawProps }
    const host = React.useRef<HTMLDivElement | null>(null)
    const [state, setState] = React.useState("loading")
    const [tag, setTag] = React.useState<string | null>(null)

    let projectJson: string
    try {
        projectJson = JSON.stringify(buildProject(props))
    } catch {
        projectJson = JSON.stringify(buildProject({ ...props, contentSource: "controls" }))
    }

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
        el.setAttribute("project", projectJson)
        el.setAttribute("asset-base-url", BASE)
        el.style.display = "block"
        el.style.width = "100%"
        el.style.height = "100%"
        host.current.replaceChildren(el)
    }, [state, tag, projectJson])

    if (state !== "ready") {
        return (
            <div style={{
                ...props.style,
                width: "100%",
                height: "100%",
                minHeight: 0,
                maxHeight: "100dvh",
                overflow: "hidden",
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
                minHeight: 0,
                maxHeight: "100dvh",
                overflow: "hidden",
                position: "relative",
                background: "#171716",
            }}
        />
    )
}

ScrollixBridge.defaultProps = DEFAULTS

const TEXTURES: TexturePreset[] = ["stone", "brick", "wood", "tiles", "woodTiles", "darkSand", "sand", "rocks"]
const ITEM_TYPES: ItemType[] = ["statement", "artwork", "quote", "profile", "image", "cta"]

addPropertyControls(ScrollixBridge, {
    quality: {
        type: ControlType.Enum,
        title: "Quality",
        options: ["auto", "low", "medium", "high", "ultra"],
    },
    texture: {
        type: ControlType.Enum,
        title: "Texture",
        options: TEXTURES,
        optionTitles: ["Stone", "Brick", "Wood", "Tiles", "Wood Tiles", "Dark Sand", "Sand", "Rocks"],
    },
    showBorders: {
        type: ControlType.Boolean,
        title: "Borders",
    },
    loop: {
        type: ControlType.Boolean,
        title: "Infinite",
    },
    spacing: {
        type: ControlType.Number,
        title: "Spacing",
        min: 8,
        max: 22,
        step: 0.5,
    },
    corridorWidth: {
        type: ControlType.Number,
        title: "Width",
        min: 5,
        max: 14,
        step: 0.25,
    },
    corridorHeight: {
        type: ControlType.Number,
        title: "Height",
        min: 3,
        max: 7,
        step: 0.1,
    },
    contentSource: {
        type: ControlType.Enum,
        title: "Content",
        options: ["controls", "json"],
        optionTitles: ["Items", "Advanced JSON"],
    },
    projectJson: {
        type: ControlType.String,
        title: "Project JSON",
        displayTextArea: true,
        hidden: (props: Partial<Props>) => props.contentSource !== "json",
    },
    items: {
        type: ControlType.Array,
        title: "Items",
        maxCount: 24,
        hidden: (props: Partial<Props>) => props.contentSource === "json",
        control: {
            type: ControlType.Object,
            controls: {
                id: { type: ControlType.String, title: "ID" },
                type: { type: ControlType.Enum, title: "Type", options: ITEM_TYPES },
                placement: {
                    type: ControlType.Enum,
                    title: "Placement",
                    options: ["station", "wall-left", "wall-right", "wall-auto"],
                    optionTitles: ["Station", "Wall left", "Wall right", "Wall auto"],
                },
                title: { type: ControlType.String, title: "Title" },
                eyebrow: { type: ControlType.String, title: "Eyebrow" },
                subtitle: { type: ControlType.String, title: "Subtitle" },
                description: { type: ControlType.String, title: "Desc", displayTextArea: true },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                image: { type: ControlType.Image, title: "Image" },
                imageAlt: { type: ControlType.String, title: "Alt" },
                size: {
                    type: ControlType.Enum,
                    title: "Size",
                    options: ["small", "medium", "large"],
                },
                lighting: {
                    type: ControlType.Enum,
                    title: "Lighting",
                    options: ["none", "subtle", "featured"],
                },
                ctaLabel: { type: ControlType.String, title: "CTA label" },
                ctaUrl: { type: ControlType.String, title: "CTA URL" },
            },
        },
    },
})

declare global {
    interface Window {
        ScrollixGalleryRuntime?: {
            init(tagName?: string): void
            registerWebComponents(tagName?: string): void
        }
    }
}
