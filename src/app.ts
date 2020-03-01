import express from 'express';

import useLoaders from './loaders';

const app = useLoaders(express());

export default app;
