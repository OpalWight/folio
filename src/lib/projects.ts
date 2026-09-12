export interface Project {
	title: string;
	year: string;
	slug: string;
	/** One-line summary used on cards and meta descriptions. */
	description: string;
	/** Three result lines, written qiaooli-style ("→ 9x increase …"). */
	results?: string[];
	/** Write-up paragraphs for the project page. */
	body?: string[];
	tags: string[];
	role?: string;
	dates?: string;
	link: string;
	github: string;
	live?: string;
	/** Recorded demo (mp4) under /static/demos/, used by the laptop hover preview when there is no live site. */
	demo?: string;
	image?: string;
	gallery?: string[];
	featured?: boolean;
	/** Shown in the playground carousel / grid. */
	playground?: boolean;
}

export const projects: Project[] = [
	{
		title: 'CareFlow',
		year: '2025',
		slug: 'careflow',
		description: 'Next.js simulator for CNA skills and written exams: an LLM evaluator scores each step of a skill against the state rubric, and hybrid retrieval keeps practice questions grounded in the real curriculum.',
		results: [
			'Skills scored turn by turn against the state rubric by DeepSeek V4 Flash, server-side',
			'Hybrid retrieval over the official curriculum: Qdrant for vectors, OpenSearch for lexical',
			'Runs on my own k3s homelab — Next.js 15, Prisma, PostgreSQL 18.4'
		],
		body: [
			'Certified nursing assistants pass a skills exam where an evaluator watches them perform a procedure step by step, and marks it against a checklist where missing one item fails the whole skill. CareFlow simulates that: the student talks through a skill, and the evaluator scores each step against the rubric and pushes back on what they got wrong. Evaluation runs server-side on DeepSeek V4 Flash, with turn idempotency keys so a retried request cannot double-score an attempt.',
			'The written side generates practice questions with retrieval over the official study material, using Qdrant for vector search and OpenSearch for lexical search together — pure vector search kept returning passages that were topically close but missed the exact term a question needed. Question generation itself runs offline through Gemini as a scripted job rather than in the request path, so the live service never waits on a generation call.',
			'Getting the curriculum in was its own project. CNAScraper crawls the official textbook\'s table of contents, walks the chapter and front-matter links, carries the part title down as hierarchical context, and splits the text recursively into chunks that keep that context attached. Without the hierarchy the chunks are unusable — a paragraph about hand placement means nothing if you cannot tell which procedure it belongs to.',
			'Rubric detail varies by state, so skills procedures are stored per exam provider with their own scenario seeds rather than one national checklist. On the operations side, the hosted tier sleeps its containers after inactivity, so keepwarm is a tiny Node script that pings the front end and the API every fourteen minutes to beat the cold-start window. It is not clever, but a student hitting a thirty-second cold start on their first question does not come back.'
		],
		tags: ['React', 'Node', 'SQL', 'AI'],
		role: 'Solo developer',
		dates: '2025',
		link: '/projects/careflow',
		github: 'https://github.com/OpalWight/CareFlow2',
		live: 'https://careflowlearn.org',
		image: '/previews/careflow.png',
		featured: true
	},
	{
		title: 'Neurotech Internals',
		year: '2025',
		slug: 'neurotech-internal',
		description: 'Internal platform on Svelte and AWS Serverless for club administration, event attendance via photo metadata, and member management.',
		results: [
			'Attendance from photo EXIF: the client extracts capture location, a Lambda confirms it against the event within 1 km',
			'Photos upload straight from the browser to S3, with SQS keeping confirmation off the request path',
			'Svelte and Hono on Lambda, with DynamoDB, S3, SQS and Bedrock behind it'
		],
		body: [
			'Running a student neurotech club meant a lot of spreadsheets: who is a member, who showed up, who owes dues. Internals replaces them with one Svelte app on AWS Serverless.',
			'Attendance is the part worth describing. An admin creates an event with a name, time and a latitude and longitude. Members upload a photo of themselves at the event, and the app reads the EXIF capture location out of the image to confirm they were actually there. The extraction happens client-side and the photo goes directly to S3 from the browser, so the API never touches image bytes — traffic spikes hard during an event and barely exists otherwise, and this keeps the spike off the functions entirely. A Lambda then works through an SQS queue comparing photo location to event location, currently against a 1 km threshold.',
			'Anything ambiguous lands in a review queue instead of being guessed at. Admins page through the flagged entries with presigned S3 URLs and approve or reject each one, which matters because the honest failure mode of EXIF-based attendance is a stripped or missing location tag, not a forged one.',
			'The stack is deliberately cheap: Svelte and Hono for a small bundle, DynamoDB because the free tier covers a club\'s entire dataset, S3 for photos. Dues and merch tracking are the next thing to automate.'
		],
		tags: ['Svelte', 'AWS', 'Serverless'],
		role: 'Lead developer',
		dates: '2025',
		link: '/projects/neurotech-internal',
		github: 'https://github.com/OpalWight/Neurotech-Website',
		image: '/previews/neurotech-internal.png',
		featured: true
	},
	{
		title: 'Efferent Systems — pyBCI',
		year: '2026',
		slug: 'pybci',
		description: 'Brain–computer interface toolkit built around a visual pipeline editor: wire EEG source to filter to model to application output, and watch each stage\'s latency as it runs.',
		results: [
			'Builder mode wires a pipeline end to end: raw EEG source → band-pass → model input → classifier → application control',
			'Every stage reports its own latency in milliseconds as the pipeline runs',
			'Replay from a recorded .fif session, so a pipeline can be validated without a headset on'
		],
		body: [
			'pyBCI is the software side of Efferent Systems: one editor covering the whole BCI workflow, from streams and markers through preprocessing, training and review. The premise is that BCI development is mostly plumbing — everyone rebuilds the same acquisition, filtering and windowing code before they get to the part they actually care about.',
			'The centre of it is builder mode, where a pipeline is a chain of typed stages: a raw EEG source, a Butterworth band-pass transform, a feature stage feeding model input, a classifier, and an application-control output at the end. Each node shows its own state and the milliseconds it spent, so when the loop feels sluggish you can see which stage is responsible instead of guessing.',
			'Sources can be a live stream or a replay from a recorded .fif file, which is the difference between iterating on a decoder in a few seconds and having to gel up an electrode cap every time you change a parameter.',
			'The public site at pybci.dev is a Next.js 16 and React 19 app carrying the mission, docs, changelog and demo pages, with mailing-list signups persisted to Neon Postgres. Deeper architecture notes and benchmarks are still to come.'
		],
		tags: ['BCI', 'Python', 'Real-time'],
		role: 'Founding engineer',
		dates: '2025 — 2026',
		link: '/projects/pybci',
		github: 'https://github.com/OpalWight/pyBCI_web',
		live: 'https://pybci.dev',
		image: '/previews/pybci.png',
		featured: true
	},
	{
		title: 'Computational RNA Biology & Medicine Lab',
		year: '2025',
		slug: 'rna-lab',
		description: 'Testing whether computed RNA base-pairing probabilities can stand in for noisy, expensive icSHAPE measurements in RNA-binding-protein models.',
		results: [
			'Binding-site overlap measured for 62 RNA-binding proteins across two cell lines, K562 and HepG2',
			'Five overlap thresholds from 1 bp to 100 bp, to separate real conservation from coordinate slop',
			'pSHAPE computed as 1 − the column sum of the base-pairing probability matrix, as an icSHAPE substitute'
		],
		body: [
			'icSHAPE gives you a per-nucleotide reactivity profile for an RNA, but the signal is noisy and expensive to collect, and it only exists for the cell types someone has already paid to measure. The question in the lab was whether base-pairing probabilities from thermodynamic folding could stand in for that experimental signal, which would let structure-aware binding models generalise to cell types with no icSHAPE data at all.',
			'The substitute is pSHAPE: fold the region, take the base-pairing probability matrix, and compute 1 minus each column\'s sum, which estimates how unpaired each nucleotide is and so carries the same meaning as a reactivity value. I built the pipeline that produces it — tracing each 101-nucleotide binding window back to its transcript through the GENCODE v42 annotation and transcriptome, expanding the window on both sides for folding context, truncating at transcript boundaries rather than padding, mapping icSHAPE bigWig signal onto the expanded window, folding, then cropping the result back to the original 101-nt core so it drops straight into CellRBP\'s training format. Folding runs on RNAstructure rather than ViennaRNA, which I switched to after ViennaRNA\'s Python API produced results that disagreed with its own web tool.',
			'Separately I measured how much binding is actually conserved between cell types, computing Jaccard overlap of binding sites for 62 proteins between K562 and HepG2. Doing that at a single threshold is misleading, because two peaks a few bases apart are the same site in biology and different sites in a set-intersection, so I ran it at 1, 5, 10, 30 and 100 bp and compared the curves. Those overlap figures then got lined up against cross-cell AUC — train on one cell line, test on the other — to ask whether proteins that bind consistently are the ones whose models transfer.',
			'The supporting work was less glamorous and mattered just as much: stripping pseudoknots out of reference structures, clipping reactivities to a maximum of 3, zeroing negatives and marking missing values, and sweeping the Deigan SHAPE-directed folding parameters around their m = 1.8, b = −0.6 defaults. Reactivity data is full of values that are physically meaningless and will happily train a model on nothing.'
		],
		tags: ['Bioinformatics', 'TensorFlow', 'Research'],
		role: 'Undergraduate researcher',
		dates: '2025',
		link: '/projects/rna-lab',
		github: 'https://github.com/OpalWight/BindingSiteOverlap',
		featured: true
	},
	{
		title: 'ZUMA',
		year: '2026',
		slug: 'zuma',
		description: 'Hackathon brain-to-text pipeline that projects EEG and fNIRS into CLIP semantic space, retrieves the closest command, and has Gemma write the care-team alert.',
		results: [
			'EEG → 768D ZUNA latent → 512D CLIP space → retrieved command, as one pipeline',
			'Confidence router: ≥0.85 executes, 0.50–0.85 asks to confirm, below 0.50 is dropped',
			'Written end to end in under eight hours, first commit to last'
		],
		body: [
			'ZUMA was a hackathon attempt at the decoding problem from the other end. Most brain-to-text work tries to predict characters or phonemes. I wanted to skip the spelling entirely: project the neural signal into a semantic space that already has structure, then find the nearest thing a person might plausibly be trying to say.',
			'The pipeline is a chain of small pieces. Preprocessed EEG goes into a ZUNA-380M encoder that produces a 768-dimensional latent. A small MLP, the semantic bridge, maps that into the 512-dimensional space of CLIP\'s text encoder, which is frozen and never fine-tuned — it only supplies fixed targets. A precomputed pool of command vectors sits in that same space, so retrieval is just cosine similarity against anchors.',
			'The part I care about most is the router, because a BCI that acts on a wrong guess is worse than one that does nothing. Matches at 0.85 and above execute. Between 0.50 and 0.85 the system asks for confirmation, optionally through a binary motor-imagery classifier. Below 0.50 it stays quiet. Only once a command survives that gate does Gemma 4 turn the matched concept into natural-language text for a care team.',
			'This is hackathon code and I want to be honest about that: it was four commits in a single day, it runs on public datasets rather than a live headset, and the encoder is doing most of the work. What it does show is that the semantic-retrieval framing is buildable, and that the confidence gate is the right place to put the safety argument.'
		],
		tags: ['BCI', 'PyTorch', 'LLM', 'Python'],
		role: 'Solo developer',
		dates: 'April 2026',
		link: '/projects/zuma',
		github: 'https://github.com/OpalWight/global_hack_ZUMA',
		featured: true
	},
	{
		title: 'Luminh',
		year: '2026',
		slug: 'luminh',
		description: 'Local-first desktop app that infers fatigue and brain fog from typing rhythm, cursor motion and app-switching — without ever reading what you type.',
		results: [
			'Keystroke capture emits a key class and a timestamp, never a character',
			'A CI check fails the build if text can reach the feature layer at all',
			'Everything local: SQLCipher storage, Argon2id key derivation, capture process firewalled off the network'
		],
		body: [
			'Luminh watches how you use your computer and estimates fatigue, focus and motor stability from it. Typing gets slower and more variable when you are tired, cursor paths get less smooth, and you bounce between windows more. Those signals are real, but they are also exactly the signals a keylogger collects, which is the whole design problem.',
			'So the architecture is driven by one non-negotiable: capture keystroke timing without ever reading text. The capture process classifies each key at the OS hook itself — a CGEventTap on macOS, a low-level hook on Windows — and emits an enum plus a timestamp. The character never exists downstream. Capture runs as a separate privileged sidecar and talks to the main app one way over length-prefixed CBOR on a Unix socket, because capture is the thing holding Accessibility rights and nothing else should. There is a CI script that checks this property, so the privacy guarantee is enforced by the build rather than by my memory.',
			'Above that sits rolling feature extraction in fixed windows, per-user baselines keyed by app and hour using medians and IQR rather than means, and a composite score with a twenty-minute EMA half-life. Scores stay hidden for the first fourteen days because a personal baseline built on a few hours of data is noise. The local model reports fatigue probability, a brain-fog index, psychomotor slowing and recovery readiness, refined online against mood check-ins the user enters by hand.',
			'I also spent real time cutting the product\'s own claims down. The original spec leaned on webcam eye-tracking and on reading cognitive decline out of typing rhythm. I went through the literature and sorted each biomarker into shippable, directional, or research-only, and dropped webcam gaze from phase one entirely. Written in Rust across eight crates with a Tauri and React shell.'
		],
		tags: ['Rust', 'Tauri', 'Privacy', 'ML'],
		role: 'Solo developer',
		dates: '2026',
		link: '/projects/luminh',
		github: 'https://github.com/OpalWight/Luminh',
		image: '/previews/luminh.png',
		featured: true
	},
	{
		title: 'MLB Pitch Analyzer',
		year: '2025',
		slug: 'mlb-pitch-analyzer',
		description: 'Full-stack explorer for 2025 MLB pitch data, built as a Washington Nationals software engineering assignment.',
		results: [
			'Pitch metrics aggregated per pitch type in Postgres: velocity, break, spin rate, exit velo, launch angle',
			'A 3D carousel of ten pitchers written from scratch — trigonometry, not a carousel library',
			'FastAPI and SQLAlchemy behind two endpoints, source data migrated from SQLite to Neon Postgres'
		],
		body: [
			'This was the take-home for a Washington Nationals software engineering internship. The data was a season of 2025 pitch-level records; the brief was to make something a person would actually want to click through.',
			'The backend is FastAPI with SQLAlchemy 2.0 and Pydantic v2 over Neon Postgres. Two endpoints do the work: one lists the featured pitchers, one returns a pitcher\'s summary. That summary is a GROUP BY over pitch type that rolls up count, usage share, velocity, horizontal and vertical break, spin rate, and where the ball went afterwards — exit speed and launch angle. Nulls are common in batted-ball columns, so the aggregation handles them rather than dropping rows. Indexes on pitcher and date, and on pitcher and pitch type, keep it quick.',
			'The front end is React and Vite with Tailwind. I wrote the 3D carousel myself instead of pulling a library, positioning each card with x = sin(angle) × radius and z = cos(angle) × radius on a 700px radius, then driving scale, opacity and grayscale off depth so the back of the ring recedes properly. It auto-rotates slowly and pauses on hover. The cards flip on hover to a second face, and search filters the roster live with an autocomplete dropdown.',
			'The detail page pairs the aggregate table with a pie chart of pitch usage, which is the one view that makes a pitcher\'s repertoire obvious at a glance.'
		],
		tags: ['React', 'FastAPI', 'PostgreSQL'],
		role: 'Solo developer',
		dates: 'November 2025',
		link: '/projects/mlb-pitch-analyzer',
		github: 'https://github.com/OpalWight/Nat-assesment',
		featured: true
	},
	{
		title: 'Neurotech Rover',
		year: '2025',
		slug: 'neural-voyager',
		description: 'SSVEP brain–computer interface: four checkerboards flicker at different rates, and looking at one drives the rover that way.',
		results: [
			'Four flickering checkerboard patches, one per drive direction, each at its own rate',
			'Verified by epoch-averaged PSD over eight occipital channels, target and second harmonic marked',
			'Decoded direction sent as single serial characters to an Arduino driving two motors'
		],
		body: [
			'Neuro-Voyager drives a small rover with an SSVEP interface. Four checkerboard patches sit around the screen — top, left, right and bottom — each inverting at its own rate, 12, 8, 15 and 10 Hz in the stimulus program. Look at one and your visual cortex produces activity at that frequency, so decoding which direction you want becomes a question of which peak is strongest rather than a classifier trained on intent.',
			'The stimulus is a MATLAB program that flips each checkerboard on its own half-period schedule and pushes markers out over LSL, so the stimulus timeline and the EEG land in the same XDF recording and stay aligned. The analysis side is Python: pyxdf loads the recording, MNE wraps it as a Raw object, and the signal gets bandpassed 5 to 35 Hz with a 60 Hz notch for mains hum before anything else happens. Filtering choices matter here more than usual, because the whole method depends on peaks that sit in the low tens of Hz.',
			'Verification is visual, and it is the step that saved the most time. The analysis script plots an epoch-averaged power spectral density per target frequency across the occipital and parieto-occipital channels — O1, O2, Oz, O9, O10, PO3, PO4, Pz — with dashed markers at the target and its second harmonic. A trial that worked shows an obvious spike sitting on the marker; one that did not, does not. Being able to see that before touching a decoder means you know whether you are debugging the classifier or the electrode contact.',
			'The rover end is intentionally plain. An Arduino listens on serial for single characters — w, a, s, d, e — and maps them to forward, turn, reverse and stop across two motor channels at fixed speed. Built with the Neurotech at Davis team.'
		],
		tags: ['BCI', 'Robotics', 'Python', 'MATLAB'],
		role: 'Team member',
		dates: 'February — April 2026',
		link: '/projects/neural-voyager',
		github: 'https://github.com/Neurotech-Davis/Neuro-Voyager',
		image: '/previews/neural-voyager.png',
		playground: true
	},
	{
		title: 'EEG Glasses',
		year: '2026',
		slug: 'eeg-glasses',
		description: 'Wearable EEG in a glasses form factor.',
		body: [
			'Dry electrodes in the temple arms, amplifier in the bridge. Write-up in progress.'
		],
		tags: ['Hardware', 'EEG'],
		role: 'Hardware + firmware',
		dates: '2026',
		link: '/projects/eeg-glasses',
		github: '',
		playground: true
	},
	{
		title: 'Homelab — The Ranch',
		year: '2025',
		slug: 'the-ranch',
		description: 'Custom k3s homelab for media streaming, high-availability file storage and local machine-learning workloads; haybale is its drop-box service.',
		results: [
			'Go API and a separate Go worker, with PostgreSQL for metadata, MinIO for blobs, Redis for the queue',
			'Service-oriented, not microservices: the drive and the music service share hardware and nothing else',
			'Three-laptop k3s cluster with Longhorn replicated volumes and Tailscale ingress'
		],
		body: [
			'The Ranch is a k3s cluster built out of three laptops that runs the boring, useful things: replicated file storage, media streaming, and somewhere to train models locally without renting a GPU.',
			'The design decision I actually thought about was the split between services. A shared-folder setup is simplest, a monolith is hard to maintain, and full microservices are more coordination than one person should sign up for. So the cluster is service-oriented: the drive and the music service are independent stacks that happen to live on the same hardware, each with its own API layer, its own Postgres, and its own dedicated Longhorn volume. The point is the failure boundary — the music platform falling over does not take my files with it.',
			'haybale is the drop-box service on top of that, written in Go. The API handles metadata, auth and routing, and hands anything slow to a separate worker over Redis, so thumbnailing and background processing never block an upload. File bytes go to MinIO, metadata to PostgreSQL, and a SvelteKit front end sits over the whole thing. It is packaged with Helm and reachable over Tailscale rather than being exposed to the internet.',
			'Everything else I run ends up here eventually — CareFlow\'s production database lives on this cluster.'
		],
		tags: ['Linux', 'Kubernetes', 'Go'],
		role: 'Everything',
		dates: '2025 — ongoing',
		link: '/projects/the-ranch',
		github: 'https://github.com/OpalWight/The-Ranch',
		image: '/previews/haybale.png',
		playground: true
	},
	{
		title: 'Cyclone RoboSub',
		year: '2026',
		slug: 'cyclone',
		description: 'UC Davis\'s autonomous submarine team: YOLO gate detection on the perception side, and the team\'s public Vue site rebuilt for accessibility.',
		results: [
			'YOLO gate detection for an autonomous submarine, with inference distributed across nodes to hold frame rate',
			'Rebuilt the site\'s infinite carousel to meet the university\'s accessibility standard: keyboard focus, pause on hover and focus, labelled modal viewer',
			'Vue site with landing, team, subteams, sponsors, robots, join and contact views, open-sourced under BSD-3'
		],
		body: [
			'Cyclone RoboSub is UC Davis\'s autonomous submarine team. My work there has been split between the perception stack and the team\'s public website.',
			'On perception, the task is gate detection: find the competition gate in the sub\'s camera feed and keep finding it while the sub moves. That runs on YOLO, with inference distributed across nodes so the detection rate keeps up with the camera rather than falling behind it.',
			'The website is a Vue app covering the landing, about, team, subteams, sponsors, robots, join and contact views, with components for rendering Markdown and embedding PDFs so non-developers on the team can update copy and member lists without touching Vue. The source is released under BSD-3 as an example of the team\'s development practices, with the name and branding reserved.',
			'On that site I rebuilt the infinite image carousel to meet the university\'s accessibility standard. The original was a mouse-only widget that animated continuously. The rebuilt one is a labelled region that takes keyboard focus, pauses on hover and on focus so it is not moving while someone is reading it, hides the decorative duplicate arrows from assistive technology instead of leaving them in the tab order, and opens images into a proper modal dialog with an accessible name and labelled previous, next and close controls. Every image carries alt text with a sane fallback.'
		],
		tags: ['Python', 'YOLO', 'Vue'],
		role: 'Perception + web',
		dates: '2026',
		link: '/projects/cyclone',
		github: 'https://github.com/Cyclone-Robosub/website-source',
		live: 'https://cyclone-robosub.github.io',
		image: '/previews/cyclone.png',
		gallery: ['/previews/robosub.png'],
		playground: true
	},
	{
		title: 'Moosic',
		year: '2025',
		slug: 'moosic',
		description: 'Local, open-source macOS app for vocal training: Demucs source separation, Whisper transcription, Accelerate pitch tracking.',
		results: [
			'Demucs splits any MP3, WAV or M4A into isolated vocals and instrumental, locally',
			'Whisper transcribes the lyrics with word-level timestamps for line-by-line scoring',
			'Pitch tracked in Hz through Apple\'s Accelerate framework; nothing ever leaves the Mac'
		],
		body: [
			'Moosic is a vocal training app for macOS. Drop in a song and it pulls the voice out, lines the lyrics up in time, and grades your pitch against the original while you sing.',
			'Three models do the work and each is doing a job the others cannot. Meta\'s Demucs handles source separation, so you get a clean vocal reference and an instrumental to actually sing over. Whisper transcribes the lyrics with word-level timestamps, which is what makes real-time scoring possible — without per-word timing you can only grade a whole take after the fact. Pitch tracking runs through Apple\'s Accelerate framework rather than a Python DSP stack, because the feedback has to be immediate and a round trip through anything heavier is audible as lag.',
			'All of it runs on the machine. There is no upload step and no account, partly on principle and partly because singing badly in private is the entire use case. Apple Silicon is strongly recommended since Demucs and Whisper are doing real work on every import.'
		],
		tags: ['Swift', 'Audio', 'ML'],
		role: 'Solo developer',
		dates: '2025',
		link: '/projects/moosic',
		github: 'https://github.com/OpalWight/moosic',
		image: '/previews/moosic.png',
		playground: true
	},
	{
		title: 'Song Hit Predictor',
		year: '2025',
		slug: 'song-hit-predictor',
		description: 'Gradient-boost model predicting song popularity from audio features. Svelte frontend, Flask backend.',
		body: [
			'A gradient-boosted model over Spotify audio features, predicting popularity. Svelte frontend, Flask backend.'
		],
		tags: ['ML', 'Svelte', 'Flask'],
		role: 'Solo developer',
		dates: '2025',
		link: '/projects/song-hit-predictor',
		github: '',
		image: '/previews/song-hit-predictor.png',
		playground: true
	},
	{
		title: 'HerdUp',
		year: '2025',
		slug: 'herdup',
		description: 'Finds the walking route two people can share the most of, and draws both paths on one map.',
		results: [
			'Dijkstra over a geocoded walking graph, solved for the longest shared segment between two routes',
			'Addresses resolved through Nominatim with an LRU cache and timeout handling to stay inside the rate limit',
			'Both routes rendered onto a single Folium map and returned to the React front end as HTML'
		],
		body: [
			'HerdUp answers a small question: two people are walking to different places from different starting points, so how much of the trip can they do together? It takes both origin and destination pairs and returns the route that maximises the overlap, plus a map showing it.',
			'The core is a Dijkstra implementation I wrote directly rather than pulling from a graph library, with a second mode that solves both walkers at once and reconstructs the shared portion. Locations come in as place names, get geocoded through Nominatim, and are cached with an LRU wrapper because the public geocoder is rate limited and a route with a handful of stops will otherwise hit it repeatedly for the same points. Geocoder timeouts and outages are caught rather than allowed to kill the request.',
			'The result is drawn with Folium into a standalone HTML map with both paths on it, which is the output that actually communicates something — a list of node names does not. Flask serves it over a small CORS-configured API, and the front end is React and TypeScript deployed on Vercel.',
			'It is a short, weekend-shaped project and the graph is built from straight-line distances between the given points rather than real street geometry, which is the obvious next thing to fix.'
		],
		tags: ['Python', 'Flask', 'React', 'Algorithms'],
		role: 'Solo developer',
		dates: 'August 2025',
		link: '/projects/herdup',
		github: 'https://github.com/OpalWight/HerdUp',
		image: '/previews/herdup.png',
		playground: true
	},
	{
		title: 'Hand Tracking',
		year: '2025',
		slug: 'hand-tracking',
		description: 'Browser hand tracking with MediaPipe: 21 landmarks per hand, two hands at once, nothing leaves the client.',
		results: [
			'21 landmarks per hand, up to two hands, at 30 fps, fully client-side',
			'Left and right hands separated with per-hand confidence and drawn in different colours',
			'Tracking data exportable as JSON with per-frame timestamps and measured frame rate'
		],
		body: [
			'This is a small, focused MVP: get real hand tracking running in a browser tab with no server in the loop. MediaPipe Hands v0.10.3 does the detection, React 18 and TypeScript on Vite handle everything around it.',
			'It tracks the full 21-point landmark set per hand — wrist, then four joints for each finger from CMC through to the tip — and identifies handedness, so left and right get drawn in different colours with the key landmarks numbered over the live video. Two hands can be tracked simultaneously.',
			'The pipeline runs at 30 fps with WebGL acceleration and falls back to lower resolution rather than dropping frames when the device cannot keep up. Landmarks come out as normalised x, y, z plus a visibility score, and the whole stream can be exported as JSON with the measured frame rate attached, which is what makes it useful as a front end for something else rather than just a demo.',
			'The only network call is the initial 16MB model download. After that the video never leaves the machine.'
		],
		tags: ['TypeScript', 'React', 'MediaPipe', 'Computer Vision'],
		role: 'Solo developer',
		dates: 'August 2025',
		link: '/projects/hand-tracking',
		github: 'https://github.com/OpalWight/handtracker',
		playground: true
	},
	{
		title: 'PC Parts Sentiment',
		year: '2025',
		slug: 'pc-parts-sentiment',
		description: 'Scrapes r/pcbuilds and scores how people actually talk about each PC component brand, using VADER.',
		results: [
			'Brand mentions matched by alias across CPU, GPU, motherboard and other component categories',
			'VADER compound scores bucketed at ±0.05 into positive, neutral and negative per brand',
			'Rate-limited scraping with a configurable delay, two seconds between calls by default'
		],
		body: [
			'Brand reputation in PC building is mostly folklore passed around in comment threads. This tool tries to measure it: pull posts and comments from r/pcbuilds, find every brand mention, and score the sentiment of the text around it.',
			'Brands live in a JSON file rather than in code, keyed by component category, each with a list of aliases — so Ryzen and i7 resolve to their makers, and RTX and Radeon to theirs. That file is the thing you edit to change what gets tracked, which keeps the matcher itself simple.',
			'Sentiment comes from VADER, which is a good fit here because it was tuned on social text and handles the things Reddit comments are full of: negation, intensifiers, punctuation and slang. Scores are classified against the standard ±0.05 compound-score cutoffs and then aggregated per brand into a mention count and an average.',
			'The scraper is deliberately polite — a configurable delay between API calls, defaulting to two seconds, and credentials and limits all read from environment variables rather than hardcoded.'
		],
		tags: ['Python', 'NLP', 'Reddit API'],
		role: 'Solo developer',
		dates: 'August 2025',
		link: '/projects/pc-parts-sentiment',
		github: 'https://github.com/OpalWight/PCPartsSentiment',
		playground: true
	}
];

export const featured = projects.filter((p) => p.featured);
export const playground = projects.filter((p) => p.playground);

export function nextProject(slug: string): Project {
	const i = projects.findIndex((p) => p.slug === slug);
	return projects[(i + 1) % projects.length];
}
