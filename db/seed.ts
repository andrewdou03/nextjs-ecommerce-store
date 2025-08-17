import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
import { hash } from '@/lib/encrypt';

async function main () {
	const prisma = new PrismaClient();
	await prisma.product.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();


	await prisma.product.createMany({
		data: sampleData.products,
	});

	const users = [];
	for (let i = 0; i < sampleData.users.length; i++) {
		const user = sampleData.users[i];
		const hashedPassword = await hash(user.password);
		users.push({ ...user, password: hashedPassword });
	}

	await prisma.user.createMany({
		data: users,
	});
	console.log('Database seeded with sample data');
}

main();