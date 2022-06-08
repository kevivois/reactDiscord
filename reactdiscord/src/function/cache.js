export const name = "data";
/**
 * 
 * @param {any{}} JsonData 
 */
export async function addSingleData(JsonData)
{

    const cache = await caches.open(name);
    cache.add(JsonData)

}
/**
 * 
 * @param {any[]} JsonData 
 */
export async function addDatas(JsonData)
{

    const cache = await caches.open(name);
    cache.addAll(JsonData);

}
/**
 * 
 * @param {*} filter 
 */
export async function get(filter)
{
    const cache = await caches.open(name);
    await cache.match(filter);
}