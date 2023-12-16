import { getProviders, makeBigLogoURL, monetizationTypes } from './globals';
import { Suspense, For, createResource, Show } from 'solid-js';
import './MovieProviders.scss';

type Props = { id: number };

export default function MovieProviders(props: Props) {
	const [providers] = createResource(() => props.id, getProviders);
	return <div id="movie-providers">
		<Suspense fallback={<span>Loading</span>}>
			<Show
				when={Object.keys(providers() ?? {}).length > 1}
				fallback={<b>This is not available to stream in your region</b>}
			>
			<For each={Object.keys(monetizationTypes) as ('flatrate' | 'buy' | 'rent')[]}>{type => {
				const name = monetizationTypes[type];
				const providersList = providers()![type];
				return <Show when={providersList !== undefined && providersList.length > 0}>
					<h4 class="monetization-header"><b>{name}</b></h4>
					<a href={providers()!.link}>
						<For each={providersList}>{provider =>
							<img
								class="big_logo logo"
								src={makeBigLogoURL(provider.logo_path)}
								alt={provider.provider_name}
								title={provider.provider_name}
							/>
						}</For>
					</a>
				</Show>;
			}}</For>
			</Show>
		</Suspense>
	</div>;
}
