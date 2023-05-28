import { isAuth } from "../utils.js";

import {
  readFileWithoutAwait,
  readFileWithAwait,
} from "../controllers/file.js";

import {
  tambahKoleksiBuku,
  lihatKoleksiBuku,
  tambahKoleksiBookShelf,
  lihatKoleksiBookShelf,
  updateKoleksiBookShelf,
  deleteKoleksiBookShelf,
  beliBuku,
  filterBookShelfByID,
  filterArrayKoleksiBookShelf,
  filterBookShelfCollection,
  listKoleksiGenreBookShelf,
  listGenreSetiapBuku,
  listGenreSetiapBukuUnwind,
} from "../controllers/db.js";

import express from "express";
const router = express.Router();

router.post("/beliBuku/beli", isAuth, beliBuku);

router.get("/beliBuku/readFileWithoutAwait", isAuth, readFileWithoutAwait);
router.get("/beliBuku/readFileWithAwait", isAuth, readFileWithAwait);

//mongo
router.get("/beliBuku/books", isAuth, lihatKoleksiBuku);
router.post("/beliBuku/books", isAuth, tambahKoleksiBuku);

router.post("/beliBuku/bookShelf", isAuth, tambahKoleksiBookShelf);
router.get("/beliBuku/bookShelf", isAuth, lihatKoleksiBookShelf);
router.put("/beliBuku/bookShelf", isAuth, updateKoleksiBookShelf);
router.delete("/beliBuku/bookShelf", isAuth, deleteKoleksiBookShelf);

router.get("/beliBuku/bookShelf", isAuth, filterBookShelfByID);

router.get("/beliBuku/bookShelf/filter/", isAuth, filterArrayKoleksiBookShelf);
router.get("/beliBuku/bookShelf/filter/", isAuth, filterArrayKoleksiBookShelf);
router.get("/beliBuku/bookShelf/listGenre/", isAuth, listKoleksiGenreBookShelf);

router.get(
  "/bookPurchasing/bookShelf/genreSetiapBuku/",
  isAuth,
  listGenreSetiapBuku
);
router.get(
  "/bookPurchasing/bookShelf/splitGenreSetiapBuku/",
  isAuth,
  listGenreSetiapBukuUnwind
);

export default router;
