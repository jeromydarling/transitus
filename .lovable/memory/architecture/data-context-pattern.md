# TransitusDataContext Migration Pattern

## Current State
- `src/contexts/TransitusDataContext.tsx` uses `useState` + `localStorage`
- All 21 pages and 12 forms consume data via `useTransitusData()` hook
- Context exposes: entity arrays, CRUD functions, searchAll(), user role

## Migration Rule
Keep the SAME context hook API. Replace internals only.

### Before (localStorage):
```ts
const [places, setPlaces] = useState<Place[]>(loaded);
const addPlace = (p) => setPlaces(prev => [...prev, p]);
```

### After (Supabase):
```ts
const { data: places } = useQuery(['places'], () => supabase.from('places').select('*'));
const { mutate: addPlace } = useMutation(
  (p) => supabase.from('places').insert(p),
  { onSuccess: () => queryClient.invalidateQueries(['places']) }
);
```

## Why This Matters
If the hook API changes, all 21 pages and 12 forms break. Keep the interface, swap the engine.
