import test, {ExecutionContext} from 'ava';

test('Simple demo test', (t: ExecutionContext) => {
	console.log('Demo Ava test');
	t.is(true, true);
});
